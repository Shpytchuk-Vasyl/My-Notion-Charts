export const Greeting = () => {
  return (
    <section className="mx-auto mt-4 flex size-full max-w-3xl flex-col justify-center px-4 md:mt-16 md:px-8">
      <h2 className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-500 fill-mode-[both] font-semibold text-xl md:text-2xl">
        Hello there!
      </h2>
      <p className="animate-in fade-in-0 slide-in-from-bottom-2 duration-500 delay-600 fill-mode-[both] text-xl text-zinc-500 md:text-2xl">
        How can I help you today?
      </p>
    </section>
  );
};
