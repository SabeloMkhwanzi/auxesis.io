'use client';

import React, { useState } from 'react';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import { useWallet } from './WalletProvider';

interface AddressInputProps {
  className?: string;
  placeholder?: string;
}

export const AddressInput: React.FC<AddressInputProps> = ({ 
  className = '',
  placeholder = "Enter wallet address (0x...)"
}) => {
  const { 
    manualAddress, 
    setManualAddress, 
    isValidAddress,
    setManualMode,
    isManualMode 
  } = useWallet();
  
  const [inputValue, setInputValue] = useState(manualAddress);
  const [showValidation, setShowValidation] = useState(false);
  
  const isValid = isValidAddress(inputValue);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setInputValue(value);
    setShowValidation(value.length > 0);
    
    // Auto-enable manual mode when user starts typing
    if (value.length > 0 && !isManualMode) {
      setManualMode(true);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      setManualAddress(inputValue);
      setManualMode(true);
    }
  };
  
  const handleClear = () => {
    setInputValue('');
    setManualAddress('');
    setShowValidation(false);
    setManualMode(false);
  };
  
  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`
              w-full pl-10 pr-12 py-3 border rounded-lg font-mono text-sm
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors
              ${showValidation 
                ? isValid 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-red-500 bg-red-50'
                : 'border-gray-300 bg-white hover:border-gray-400'
              }
            `}
          />
          
          {/* Validation icon */}
          {showValidation && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {isValid ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500" />
              )}
            </div>
          )}
          
          {/* Clear button */}
          {inputValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Validation message */}
        {showValidation && (
          <div className={`mt-2 text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? (
              <div className="flex items-center space-x-1">
                <CheckCircle className="w-4 h-4" />
                <span>Valid Ethereum address</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>Please enter a valid Ethereum address (0x...)</span>
              </div>
            )}
          </div>
        )}
        
        {/* Submit button */}
        {inputValue && isValid && (
          <button
            type="submit"
            className="mt-3 w-full bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Portfolio
          </button>
        )}
      </form>
      
      {/* Current manual address display */}
      {isManualMode && manualAddress && isValidAddress(manualAddress) && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Viewing Portfolio:</p>
              <p className="text-xs font-mono text-blue-700 break-all">{manualAddress}</p>
            </div>
            <button
              onClick={handleClear}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
