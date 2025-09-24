import React from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { useCurrency } from '../context/CurrencyContext';

// FIX: Changed component signature to accept the full props object to resolve type inference errors with recharts' TooltipProps.
const CustomChartTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload, label } = props;
  const { formatCurrency } = useCurrency();
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-light-card dark:bg-dark-bg/80 backdrop-blur-sm border border-light-border dark:border-white/20 rounded-lg shadow-lg text-sm">
        <p className="font-bold text-text-primary dark:text-dark-text mb-1">{`${label || payload[0].name}`}</p>
        {payload.map((p, index) => (
          <p key={index} style={{ color: p.color || p.fill }}>
            {`${p.name || 'Value'}: ${typeof p.value === 'number' ? formatCurrency(p.value) : p.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export default CustomChartTooltip;