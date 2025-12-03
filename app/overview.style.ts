import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  sidebar: {
    width: 200,
    backgroundColor: "#2c3e50",
    paddingTop: 20,
  },
  sidebarHeader: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: "transparent",
  },
  sidebarItemActive: {
    backgroundColor: "#34495e",
    borderLeftColor: "#1a8fe3",
  },
  sidebarIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  sidebarText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  sidebarSpacer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },stepNumber: {
  fontSize: 14,
  fontWeight: '600',
  color: '#333',
  marginBottom: 8,
},
cardStepCount: {
  fontSize: 12,
  color: '#666',
  marginTop: 4,
},
  button: {
    backgroundColor: "#1a8fe3",
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonSecondary: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonSecondaryText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonRemove: {
    backgroundColor: "#ff4444",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    marginTop: 4,
  },
  buttonRemoveText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    padding: 8,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    flex: 1,
    maxWidth: "48%",
  },
  cardImage: {
    width: "100%",
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: "#e0e0e0",
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardAuthor: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardStatText: {
    fontSize: 12,
    color: "#999",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  modalClose: {
    padding: 4,
  },
  modalCloseText: {
    fontSize: 24,
    color: "#666",
  },
  modalBody: {
    padding: 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
  },
  textarea: {
    height: 100,
    textAlignVertical: "top",
  },
  checkboxContainer: {
    marginVertical: 16,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxIcon: {
    fontSize: 24,
    marginRight: 8,
    color: "#1a8fe3",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  ingredientInputs: {
    flex: 1,
    gap: 8,
  },
});
