import React from 'react';
import { AREAS, CUISINES, PURPOSES, BUDGETS } from '../constants';
import { SearchCriteria } from '../types';

interface SearchFormProps {
  criteria: SearchCriteria;
  setCriteria: React.Dispatch<React.SetStateAction<SearchCriteria>>;
  onSearch: () => void;
  isLoading: boolean;
}

const SelectField = ({ label, value, onChange, options, icon }: { label: string, value: string, onChange: (val: string) => void, options: string[], icon: string }) => (
  <div className="mb-4">
    <label className="block text-xs font-bold text-gourmet-gray tracking-wider mb-2 uppercase">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gourmet-red font-bold">
        {icon}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-paper-border rounded-xl py-4 pl-10 pr-8 appearance-none text-gourmet-dark font-medium text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gourmet-red/20 transition-all cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  </div>
);

export const SearchForm: React.FC<SearchFormProps> = ({ criteria, setCriteria, onSearch, isLoading }) => {
  
  const updateField = (field: keyof SearchCriteria, value: any) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full max-w-md mx-auto bg-paper-cream p-2">
      
      <div className="space-y-2 mb-8">
        <SelectField 
          label="區域 (AREA)" 
          icon="地"
          value={criteria.area} 
          options={AREAS} 
          onChange={(val) => updateField('area', val)} 
        />
        <SelectField 
          label="料理 (CUISINE)" 
          icon="食"
          value={criteria.cuisine} 
          options={CUISINES} 
          onChange={(val) => updateField('cuisine', val)} 
        />
        <SelectField 
          label="目的 (PURPOSE)" 
          icon="心"
          value={criteria.purpose} 
          options={PURPOSES} 
          onChange={(val) => updateField('purpose', val)} 
        />
        <SelectField 
          label="預算 (BUDGET)" 
          icon="金"
          value={criteria.budget} 
          options={BUDGETS} 
          onChange={(val) => updateField('budget', val)} 
        />
      </div>

      {/* Toggles */}
      <div className="space-y-4 mb-8 px-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gourmet-dark/80">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
            <span className="text-sm font-medium">依照目前所在地 (10-15km)</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={criteria.useLocation}
              onChange={(e) => updateField('useLocation', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gourmet-red"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gourmet-dark/80">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">僅顯示營業中 (Open Now)</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={criteria.openNow}
              onChange={(e) => updateField('openNow', e.target.checked)}
            />
             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gourmet-red"></div>
          </label>
        </div>
      </div>

      <button 
        onClick={onSearch}
        disabled={isLoading}
        className={`w-full bg-gourmet-dark text-white py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 ${isLoading ? 'opacity-80' : 'hover:bg-black'}`}
      >
        {isLoading ? (
           <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
           </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        )}
        <span>{isLoading ? 'Searching...' : '開始探索'}</span>
      </button>
    </div>
  );
};
