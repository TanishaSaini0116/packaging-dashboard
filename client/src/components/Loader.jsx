const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full min-h-[200px]">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-primary-600/20 border-t-primary-600 animate-spin"></div>
        <div className="w-8 h-8 rounded-full border-2 border-purple-600/20 border-t-purple-600 animate-spin absolute top-2 left-2" style={{animationDirection: 'reverse'}}></div>
      </div>
    </div>
  );
};

export default Loader;