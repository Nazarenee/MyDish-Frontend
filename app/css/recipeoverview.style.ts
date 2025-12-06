import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  mainContainer: {
    flex: 1,
    flexDirection: isSmallScreen ? "column" : "row",
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
    width: isSmallScreen ? "100%" : 200,
    backgroundColor: "#2c3e50",
    paddingTop: 20,
  },
  sidebarHeader: {
    paddingHorizontal: isSmallScreen ? 16 : 20,
    paddingBottom: isSmallScreen ? 16 : 30,
    borderBottomWidth: 1,
    borderBottomColor: "#34495e",
  },
  sidebarTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: "bold",
    color: "#fff",
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: isSmallScreen ? 12 : 16,
    paddingHorizontal: isSmallScreen ? 16 : 20,
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
    fontSize: isSmallScreen ? 14 : 16,
    color: "#fff",
    fontWeight: "500",
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  sidebarSpacer: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    flexDirection: isSmallScreen ? "column" : "row",
    justifyContent: "space-between",
    alignItems: isSmallScreen ? "stretch" : "center",
    gap: isSmallScreen ? 12 : 0,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: "bold",
    color: "#333",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardStepCount: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#1a8fe3",
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
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
    justifyContent: isSmallScreen ? "center" : "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    margin: 8,
    flex: isSmallScreen ? 0 : 1,
    width: isSmallScreen ? width - 32 : undefined,
    maxWidth: isSmallScreen ? "100%" : "48%",
  },
  cardImage: {
    width: "100%",
    height: isSmallScreen ? 200 : 150,
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
    color: '#c00',
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#c00',
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
    padding: isSmallScreen ? 16 : 0,
  },
  pickerContainer: {
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: isSmallScreen ? "100%" : "90%",
    maxWidth: isSmallScreen ? undefined : 600,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: isSmallScreen ? 16 : 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: isSmallScreen ? 18 : 20,
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
    padding: isSmallScreen ? 16 : 20,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: isSmallScreen ? 16 : 20,
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
  interactionSection: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  statsText: {
    fontSize: 13,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 8,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
  },
  actionButtonTextActive: {
    color: "#e74c3c",
  },
  commentsContainer: {
    maxHeight: 400,
    paddingHorizontal: 16,
  },
  noCommentsText: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
    fontStyle: "italic",
  },
  commentItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  commentHeader: {
    flexDirection: "row",
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1a8fe3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInitial: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  commentContent: {
    flex: 1,
  },
  commentUserName: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  commentDate: {
    fontSize: 12,
    color: "#999",
  },
  commentInputContainer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    alignItems: "center",
    gap: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    backgroundColor: "#1a8fe3",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: "#ccc",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  commentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  commentLikeButton: {
    padding: 4,
  },
  commentLikeText: {
    fontSize: 12,
    color: "#666",
  },
  commentLikeTextActive: {
    color: "#e74c3c",
    fontWeight: "600",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
    marginTop: 12,
    gap: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: isSmallScreen ? 12 : 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleButtonActive: {
    backgroundColor: "#1a8fe3",
  },
  toggleButtonText: {
    fontSize: isSmallScreen ? 12 : 14,
    fontWeight: "600",
    color: "#666",
  },
  toggleButtonTextActive: {
    color: "#fff",
  },
});