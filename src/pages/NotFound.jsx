const HEADER_HEIGHT = 100;

const NotFound = () => {
  return (
    <>
      <div className="relative" style={{ height: HEADER_HEIGHT }} />
      <div className="min-h-[100vh] text-center text-red-500 p-4 ">
        Page not found
      </div>
    </>
  );
};
export default NotFound;
