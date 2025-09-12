interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  onSearch, 
  placeholder = "검색어를 입력하세요" 
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="mb-4 w-full relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full h-[56px] p-4 rounded-[32px] bg-[#ececec] focus:outline-none text-sm"
      />
      <button 
        onClick={onSearch} 
        className="absolute right-4 top-1/2 transform -translate-y-1/2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
          <path d="M21.4594 21L17.0143 16.65M19.4157 11C19.4157 15.4183 15.7556 19 11.2407 19C6.72575 19 3.06567 15.4183 3.06567 11C3.06567 6.58172 6.72575 3 11.2407 3C15.7556 3 19.4157 6.58172 19.4157 11Z" stroke="#575757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21.4594 21L17.0143 16.65M19.4157 11C19.4157 15.4183 15.7556 19 11.2407 19C6.72575 19 3.06567 15.4183 3.06567 11C3.06567 6.58172 6.72575 3 11.2407 3C15.7556 3 19.4157 6.58172 19.4157 11Z" stroke="black" strokeOpacity="0.2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
