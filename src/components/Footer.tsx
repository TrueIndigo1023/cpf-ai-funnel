const Footer = ({ variant = "default" }: { variant?: "default" | "quiz" }) => {
  if (variant === "quiz") {
    return (
      <footer className="py-4 text-center text-xs text-muted-foreground">
        This tool is for educational purposes only and does not constitute financial advice. © 2026
      </footer>
    );
  }

  return (
    <footer className="bg-foreground py-8 text-center">
      <p className="text-sm text-muted-foreground">© 2026 Retirement Income Planner</p>
      <p className="text-xs text-muted-foreground mt-1">
        This tool is for educational purposes only and does not constitute financial advice.
      </p>
    </footer>
  );
};

export default Footer;
