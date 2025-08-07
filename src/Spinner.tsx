export default function Spinner() {
    return (
        <>
            <div className="spinner" />
            <style>{`
          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f97316;
            border-top-color: transparent;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: auto;
          }
  
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
        </>
    );
}