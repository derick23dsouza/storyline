"use server"

import { GoogleGenAI } from "@google/genai"


const ai= new GoogleGenAI({});

interface booksArrayType {
    name: string,
    authors:string[]
}

// export async function getBookSuggestions(books:booksArrayType[]) {

//     try {
//         const response = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: `I need you to give me similar suggestions to the array of books I will be giving you right now. Highlight the type of books the user seems interested in and also suggest books that would be complimentary to their taste along with suggestions from the existing list of genres they read from. The array is------ ${books}  -----`,
//     });
  

//     return (response.text);
        
//     } catch (error) {
//         console.log(error);
//         return ("Insights seems to be having trouble right now. Please try again later!")
        
//     }

    
    
// } 





interface booksArrayType {
  name: string;
  authors: string[];
}

export async function getBookSuggestions(books: booksArrayType[]) {
  try {
    // Make the book list human-readable
    const formattedBooks = books
      .map((b) => `${b.name} by ${b.authors?.join(", ") || "Unknown author"}`)
      .join("; ");

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `You are an AI reading assistant. 
Here is the user's book collection: ${formattedBooks}. 
Analyze it and respond with:
1. A short summary of the user’s reading taste.
2. Similar books they might enjoy.
3. Complimentary genres or new types of books to try.

Respond in markdown format for readability.`,
            },
          ],
        },
      ],
    });

    // Gemini returns a structured object, so extract text safely
    return response.text ?? "No insights generated.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Insights seem to be having trouble right now. Please try again later!";
  }
}
