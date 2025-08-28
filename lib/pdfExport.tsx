"use client";

import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { Counter } from "@/types/counter";

// PDF Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333333",
  },
  subtitle: {
    fontSize: 12,
    color: "#666666",
    marginBottom: 5,
  },
  date: {
    fontSize: 10,
    color: "#999999",
  },
  countersContainer: {
    marginTop: 20,
  },
  counterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    border: "1px solid #e9ecef",
  },
  counterName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333333",
    flex: 1,
  },
  counterCount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0066cc",
    minWidth: 50,
    textAlign: "right",
  },
  summary: {
    marginTop: 30,
    padding: 16,
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    border: "1px solid #bfdbfe",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e40af",
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#374151",
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#9ca3af",
  },
});

// PDF Document Component
const CountersPDFDocument = ({
  counters,
  title,
}: {
  counters: Counter[];
  title: string;
}) => {
  const totalCounters = counters.length;
  const totalCount = counters.reduce((sum, counter) => sum + counter.count, 0);
  const averageCount = totalCounters > 0 ? (totalCount / totalCounters).toFixed(2) : "0";
  const maxCount = totalCounters > 0 ? Math.max(...counters.map(c => c.count)) : 0;
  const minCount = totalCounters > 0 ? Math.min(...counters.map(c => c.count)) : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Reporte de Contadores</Text>
          <Text style={styles.date}>
            Generado el {new Date().toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        {/* Counters List */}
        <View style={styles.countersContainer}>
          {counters.map((counter) => (
            <View key={counter.id} style={styles.counterItem}>
              <Text style={styles.counterName}>{counter.name}</Text>
              <Text style={styles.counterCount}>{counter.count}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Total de contadores:</Text>
            <Text style={styles.summaryValue}>{totalCounters}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Suma total:</Text>
            <Text style={styles.summaryValue}>{totalCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Promedio:</Text>
            <Text style={styles.summaryValue}>{averageCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Valor máximo:</Text>
            <Text style={styles.summaryValue}>{maxCount}</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Valor mínimo:</Text>
            <Text style={styles.summaryValue}>{minCount}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Exportado desde Counter X - {new Date().getFullYear()}
        </Text>
      </Page>
    </Document>
  );
};

// Export function
export const exportCountersToPDF = async (counters: Counter[], title: string) => {
  try {
    const blob = await pdf(
      <CountersPDFDocument counters={counters} title={title} />
    ).toBlob();

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${title}-counters-${new Date().toISOString().split("T")[0]}.pdf`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error("Error exporting PDF:", error);
    return { success: false, error };
  }
};