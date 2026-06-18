export default function Maintenance() {
  return (
    <div style={styles.container}>
      <h1>🚀 New Version Incoming</h1>
      <p>We’re upgrading 8JJ Games for a better experience.</p>
      <p>Please check back soon!</p>
      <small>© 8JJ Games</small>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  }
};
