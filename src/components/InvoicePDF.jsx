import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  info: {
    fontSize: 12,
    marginBottom: 5,
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 20,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    flex: 1,
  },
  total: {
    marginTop: 20,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
});

export default function InvoicePDF({ mouvements, total }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Facture</Text>
          <Text style={styles.info}>
            Date: {format(new Date(), 'dd/MM/yyyy', { locale: fr })}
          </Text>
          <Text style={styles.info}>
            N° Facture: {format(new Date(), 'yyyyMMddHHmmss')}
          </Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.tableCell}>Produit</Text>
            <Text style={styles.tableCell}>Quantité</Text>
            <Text style={styles.tableCell}>Prix unitaire</Text>
            <Text style={styles.tableCell}>Total</Text>
          </View>

          {mouvements.map((mouvement, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{mouvement.produit_nom}</Text>
              <Text style={styles.tableCell}>{mouvement.quantite}</Text>
              <Text style={styles.tableCell}>
                {mouvement.prix_unitaire?.toFixed(2)} €
              </Text>
              <Text style={styles.tableCell}>
                {(mouvement.quantite * mouvement.prix_unitaire)?.toFixed(2)} €
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.total}>
          Total: {total?.toFixed(2)} €
        </Text>

        <Text style={styles.footer}>
          Merci de votre confiance !
        </Text>
      </Page>
    </Document>
  );
}