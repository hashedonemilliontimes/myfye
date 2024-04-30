
import React, { useState, useEffect } from 'react';

export const setLanguage = async (languageCode: string) => {
    console.log('languageManager has language code', languageCode);

    //set Language with redux
    
    //to do: set user's language

};

export interface LanguageCodeProps {
    language: 'en' | 'fr' | 'da' | 'de' 
    | 'es' | 'it' | 'pt' | 'sk' | 'ar' | 'tr' 
    | 'hi' | 'zh' | 'id' | 'ko' | 'ja' | 'ru' 
    | 'ur' | 'fl' | 'mr' | 'te' | 'ta' | 'vi' | 'sw';
    // Add any additional props here
  }