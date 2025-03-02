const DriverIcon = () => {
    return (
      <svg
        className="w-full h-full" // Tailwind utility for responsive sizing
        viewBox="0 0 24 24"
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Hat */}
        <path d="M4 8h16a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2z" />
        {/* Head */}
        <circle cx="12" cy="12" r="3" />
        {/* Shoulders */}
        <path d="M6 18c2-4 10-4 12 0" />
      </svg>
    );
  };
  
  export default DriverIcon;
  