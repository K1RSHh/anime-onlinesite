function FilterBar() {
  const Genres = [
    {
      genre: "Action",
    },
    {
      genre: "Drama",
    },
    {
      genre: "School",
    },
  ];
  return (
    <div>
      <button className="cursor-pointer">Genres</button>
      <div className="flex">
        {Genres.map((item) => (
          <button>{item.genre}</button>
        ))}
      </div>
    </div>
  );
}
export default FilterBar;
