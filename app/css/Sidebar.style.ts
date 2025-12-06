import { Dimensions, StyleSheet } from "react-native";

const { width } = Dimensions.get('window');
const isSmallScreen = width < 768;

export default StyleSheet.create({
  sidebar: {
    width: isSmallScreen ? '80%' : 200,
    backgroundColor: "#2c3e50",
    paddingTop: 20,
    height: '100%',
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
  // Mobile hamburger menu
  hamburger: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1000,
    backgroundColor: '#2c3e50',
    padding: 12,
    borderRadius: 8,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
  },
  modalSidebar: {
    width: '80%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: -60,
    zIndex: 1001,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});