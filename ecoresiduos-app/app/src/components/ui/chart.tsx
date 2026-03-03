import React, {
  createContext,
  useContext,
  ReactNode,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ViewProps,
} from 'react-native';

interface ChartConfig {
  [key: string]: {
    label?: ReactNode;
    color?: string;
  };
}

interface ChartContextProps {
  config: ChartConfig;
}

const ChartContext = createContext<ChartContextProps | null>(null);

function useChart() {
  const context = useContext(ChartContext);
  if (!context) {
    throw new Error('useChart must be used within <ChartContainer />');
  }
  return context;
}

interface ChartContainerProps extends ViewProps {
  config: ChartConfig;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const ChartContainer = React.forwardRef<
  React.ElementRef<typeof View>,
  ChartContainerProps
>(({ config, children, style, ...props }, ref) => (
  <ChartContext.Provider value={{ config }}>
    <View ref={ref} style={[styles.container, style]} {...props}>
      {children}
    </View>
  </ChartContext.Provider>
));

ChartContainer.displayName = 'ChartContainer';

const ChartTooltip = ({ children }: { children: ReactNode }) => <>{children}</>;
const ChartLegend = ({ children }: { children: ReactNode }) => <>{children}</>;

interface TooltipItem {
  name?: string;
  value?: number | string;
  color?: string;
}

interface ChartTooltipContentProps extends ViewProps {
  active?: boolean;
  payload?: TooltipItem[];
  style?: StyleProp<ViewStyle>;
}

const ChartTooltipContent = React.forwardRef<
  React.ElementRef<typeof View>,
  ChartTooltipContentProps
>(({ active, payload, style, ...props }, ref) => {
  if (!active || !payload?.length) return null;

  const { config } = useChart();

  return (
    <View ref={ref} style={[styles.tooltip, style]} {...props}>
      {payload.map((item, index) => (
        <View key={index} style={styles.tooltipItem}>
          <View
            style={[
              styles.tooltipDot,
              { backgroundColor: item.color || '#1f5c2e' },
            ]}
          />
          <View style={styles.tooltipText}>
            <Text style={styles.tooltipLabel}>
              {config[item.name || '']?.label || item.name || 'Valor'}
            </Text>
            <Text style={styles.tooltipValue}>
              {typeof item.value === 'number'
                ? item.value.toLocaleString()
                : item.value}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
});

ChartTooltipContent.displayName = 'ChartTooltipContent';

interface LegendItem {
  value?: string;
  dataKey?: string;
  color?: string;
}

interface ChartLegendContentProps extends ViewProps {
  payload?: LegendItem[];
  style?: StyleProp<ViewStyle>;
}

const ChartLegendContent = React.forwardRef<
  React.ElementRef<typeof View>,
  ChartLegendContentProps
>(({ payload, style, ...props }, ref) => {
  if (!payload?.length) return null;

  const { config } = useChart();

  return (
    <View ref={ref} style={[styles.legend, style]} {...props}>
      {payload.map((item, index) => {
        const itemKey = item.value || item.dataKey || '';
        const itemConfig = config[itemKey];

        return (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: item.color || '#1f5c2e' },
              ]}
            />
            <Text style={styles.legendLabel}>
              {itemConfig?.label || itemKey}
            </Text>
          </View>
        );
      })}
    </View>
  );
});

ChartLegendContent.displayName = 'ChartLegendContent';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  tooltip: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 5,
    minWidth: 120,
  },
  tooltipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tooltipDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  tooltipText: {
    flex: 1,
  },
  tooltipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
};
export default function _Component() { return null; }
