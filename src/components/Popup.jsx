export default function ({ show, onCancel = () => {}, children }) {
  return (
    <div
      onClick={() => onCancel?.()}
      className={`fixed z-10 inset-0 flex justify-center items-center bg-[rgba(0,0,0,0.8)]`}
      hidden={!show}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className='bg-white min-w-fit'
      >
        {children}
      </div>
    </div>
  );
}
