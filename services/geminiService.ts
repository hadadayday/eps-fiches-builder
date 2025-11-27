import { GoogleGenAI, Type } from "@google/genai";
import { FicheData } from "../types";

// Use the API Key from the environment variable
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateFicheContent = async (
  sport: string,
  grade: string,
  duration: number,
  topic: string,
  activityType: string,
  constraints: string,
  extraInstructions: string
): Promise<FicheData | null> => {
  if (!apiKey) {
    console.error("API Key is missing. Please set process.env.API_KEY");
    // Return mock data for demo purposes if no key is present
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                title: `Séance de ${sport} : ${topic}`,
                subject: "EPS",
                grade: grade,
                sport: sport,
                durationTotal: `${duration} minutes`,
                competences: ["Maîtriser les fondamentaux techniques", "S'intégrer dans le jeu collectif"],
                objectives: ["Améliorer la technique individuelle", "Développer l'esprit d'équipe", "Comprendre les règles de sécurité"],
                activities: [
                    { 
                        name: "Échauffement Général", 
                        duration: "10 min", 
                        description: "Course lente, montées de genoux, talons-fesses, rotations articulaires.",
                        organization: "Dispersés sur le terrain",
                        difficulty: "Facile",
                        variations: "Ajouter un ballon par deux"
                    },
                    { 
                        name: "Situation d'apprentissage", 
                        duration: "20 min", 
                        description: "Situation jouée avec contraintes pour favoriser l'apparition du comportement attendu.",
                        organization: "Groupes de 4, demi-terrain",
                        difficulty: "Moyen",
                        variations: "Réduire l'espace de jeu"
                    }
                ],
                materials: ["Plots", "Chasubles", "Ballons", "Sifflet"],
                safety: ["Bien s'échauffer", "Respecter les zones de jeu", "Pas de contact violent"],
                evaluation: ["Respect des consignes", "Efficacité technique"],
                indicators: ["Nombre de passes réussies", "Respect des zones"],
                differentiation: "Adapter la taille du terrain pour les élèves en difficulté.",
                notes: "Bien insister sur la sécurité lors de la situation 2."
            });
        }, 1500);
    });
  }

  try {
    const modelId = "gemini-2.5-flash";
    
    const prompt = `
      You are an expert physical education teacher in Morocco. You strictly follow the 'Orientations Pédagogiques 2007 (Collège)' and '2009 (Lycée)'.
      Use the Competency-Based Approach (APC).
      
      Details:
      - Sport : ${sport}
      - Grade/Class : ${grade} (Moroccan system)
      - Duration : ${duration} minutes
      - Main Theme/Objective : ${topic}
      - Activity Type: ${activityType}
      - Constraints: ${constraints}
      - Extra Instructions: ${extraInstructions}
      
      Structure the response as a JSON object suitable for a lesson fiche.
      Strictly include these fields: title, competences (APC), objectives (operational), materials, safety, activities (array with name, duration, description, organization, difficulty, variations), evaluation (criteria), indicators (observable), differentiation, notes.
      Ensure competences and objectives are returned as non-empty arrays of strings.
      Use concise, school-appropriate French (fr-FR).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            subject: { type: Type.STRING },
            grade: { type: Type.STRING },
            sport: { type: Type.STRING },
            durationTotal: { type: Type.STRING },
            competences: { type: Type.ARRAY, items: { type: Type.STRING } },
            objectives: { type: Type.ARRAY, items: { type: Type.STRING } },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                  organization: { type: Type.STRING },
                  difficulty: { type: Type.STRING },
                  variations: { type: Type.STRING }
                }
              }
            },
            materials: { type: Type.ARRAY, items: { type: Type.STRING } },
            safety: { type: Type.ARRAY, items: { type: Type.STRING } },
            evaluation: { type: Type.ARRAY, items: { type: Type.STRING } },
            indicators: { type: Type.ARRAY, items: { type: Type.STRING } },
            differentiation: { type: Type.STRING },
            notes: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as FicheData;

  } catch (error) {
    console.error("Error generating fiche with Gemini:", error);
    return null;
  }
};