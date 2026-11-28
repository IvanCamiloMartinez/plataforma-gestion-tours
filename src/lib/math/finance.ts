import Decimal from "decimal.js";

// Configuración de precisión decimal estricta (20 dígitos de trabajo, redondeo financiero estándar)
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export interface CostItemInput {
  id?: string;
  concept: string;
  costType: "FIXED_DEPARTURE" | "VARIABLE_PAX";
  amount: number; // En COP
}

export interface FinancialSimulationResult {
  paxCount: number;
  totalFixedCosts: number;
  totalVariablePaxCosts: number;
  totalCosts: number;
  unitCost: number;
  marginPercent: number; // Ej. 35 para 35%
  suggestedPriceMargin: number; // Redondeado al millar más cercano en COP
  suggestedPriceMarkup: number; // Para comparación
  netProfitProjected: number;
  breakEvenPax: number;
}

/**
 * Motor Financiero Desacoplado:
 * Fórmulas inmutables acordadas en DOCUMENTO_DISENO_PLATAFORMA_GESTION_TURISTICA.md (Sección 8 y 10).
 */
export function calculateFinancialSimulation(
  costs: CostItemInput[],
  paxCount: number,
  targetMarginPercent: number = 35 // Por defecto 35%
): FinancialSimulationResult {
  const pax = new Decimal(Math.max(1, paxCount));
  const marginDecimal = new Decimal(targetMarginPercent).dividedBy(100);

  // 1. Suma de Costos Fijos
  const fixedTotal = costs
    .filter((c) => c.costType === "FIXED_DEPARTURE")
    .reduce((acc, c) => acc.plus(new Decimal(c.amount)), new Decimal(0));

  // 2. Suma de Costos Variables por Persona
  const variableUnitTotal = costs
    .filter((c) => c.costType === "VARIABLE_PAX")
    .reduce((acc, c) => acc.plus(new Decimal(c.amount)), new Decimal(0));

  // 3. Costo Total para N pasajeros = CF + (CV_pax * n)
  const totalVariableForPax = variableUnitTotal.times(pax);
  const totalCosts = fixedTotal.plus(totalVariableForPax);

  // 4. Costo Unitario = Costo Total / n
  const unitCost = totalCosts.dividedBy(pax);

  // 5. Precio con Margen sobre Ventas: P = CostoUnitario / (1 - m)
  let rawPriceMargin: Decimal;
  if (marginDecimal.greaterThanOrEqualTo(1)) {
    rawPriceMargin = unitCost.times(2); // Guardia de división por cero
  } else {
    rawPriceMargin = unitCost.dividedBy(new Decimal(1).minus(marginDecimal));
  }

  // Redondeo al millar más cercano (estándar comercial colombiano)
  const roundToThousand = (val: Decimal) =>
    val.dividedBy(1000).ceil().times(1000).toNumber();

  const suggestedPriceMargin = roundToThousand(rawPriceMargin);

  // Precio Markup: P_markup = CostoUnitario * (1 + m)
  const suggestedPriceMarkup = roundToThousand(unitCost.times(new Decimal(1).plus(marginDecimal)));

  // Utilidad Neta Proyectada = (Precio * n) - CostoTotal
  const revenueTotal = new Decimal(suggestedPriceMargin).times(pax);
  const netProfitProjected = revenueTotal.minus(totalCosts).toNumber();

  // 6. Punto de Equilibrio: n_eq = ceil( CF / (Precio - CV_pax) )
  let breakEvenPax = 1;
  const unitContribution = new Decimal(suggestedPriceMargin).minus(variableUnitTotal);

  if (unitContribution.greaterThan(0)) {
    breakEvenPax = fixedTotal.dividedBy(unitContribution).ceil().toNumber();
  }

  return {
    paxCount,
    totalFixedCosts: fixedTotal.toNumber(),
    totalVariablePaxCosts: totalVariableForPax.toNumber(),
    totalCosts: totalCosts.toNumber(),
    unitCost: Math.round(unitCost.toNumber()),
    marginPercent: targetMarginPercent,
    suggestedPriceMargin,
    suggestedPriceMarkup,
    netProfitProjected: Math.round(netProfitProjected),
    breakEvenPax: Math.max(1, breakEvenPax),
  };
}
