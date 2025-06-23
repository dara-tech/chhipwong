const FormSection = ({ title, children, icon }) => {
  return (
    <div className="card bg-base-100 border-2 border-primary">
      <div className="card-body">
        <div className="flex items-center gap-2 mb-4">
          {icon && <span className="text-2xl">{icon}</span>}
          <h3 className="card-title text-lg font-semibold">{title}</h3>
        </div>
        {children}
      </div>
    </div>
  );
};

export default FormSection; 