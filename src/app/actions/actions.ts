"use server"

import { GoogleGenAI } from "@google/genai"


const ai= new GoogleGenAI({});

interface booksArrayType {
    name: string,
    authors:string[]
}

export async function getBookSuggestions(books:booksArrayType[]) {

    try {
        const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `I need you to give me similar suggestions to the array of books I will be giving you right now. Highlight the type of books the user seems interested in and also suggest books that would be complimentary to their taste along with suggestions from the existing list of genres they read from. The array is------ ${books}  -----`,
    });
  

    return (response.text);
        
    } catch (error) {
        console.log(error);
        return ("Insights seems to be having trouble right now. Please try again later!")
        
    }

    
    
}  