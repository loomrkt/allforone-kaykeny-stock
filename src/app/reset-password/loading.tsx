const Loading = () => {
  return (
    <div className="h-screen bg-white flex justify-center items-center">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent opacity-30 blur-lg animate-pulse"></div>
        <div className="flex flex-col items-center space-y-4 z-10 text-primary">
          <div className="text-4xl font-extrabold">Chargement...</div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-primary animate-bounce duration-900"></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-bounce duration-700"></div>
            <div className="w-4 h-4 rounded-full bg-primary animate-bounce duration-900"></div>
          </div>
          {/* <div className="text-sm">{t("preparingExperience")}</div> */}
        </div>
      </div>
    </div>
  );
};

export default Loading;
