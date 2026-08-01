export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          &copy; {new Date().getFullYear()} <strong>BlogSphere</strong> — Built with the MERN
          Stack.
        </p>
        <p className="footer-sub">
          Main Flow Services and Technologies Pvt. Ltd. &mdash; Full-Stack Web Development
          Internship
        </p>
      </div>
    </footer>
  );
}
