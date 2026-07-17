const Section = ({
  children,
  className = "",
}) => {
  return (
    <section
      className={`py-20 lg:py-28 ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;