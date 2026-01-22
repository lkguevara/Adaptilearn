const Layout = ({ children }) => {
  return (
    <div>
      <header className="text-primary-500 font-accent text-2xl font-bold">Header</header>

      <main>{children}</main>

      <footer>Footer</footer>
    </div>
  );
};

export default Layout;
