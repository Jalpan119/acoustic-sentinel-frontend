import { useState, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

export function useMicrophone() {
  const [isAlarming, setIsAlarming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [confidence, setConfidence] = useState(0); // New state to show AI certainty

  // Using 'any' here to bypass strict TypeScript compilation errors for the ML model
  const recognizerRef = useRef<any>(null);

  // Your custom Google Teachable Machine model URL
  const URL = "https://teachablemachine.withgoogle.com/models/W-iJtoRIIN/";

  const startListening = async () => {
    try {
      setIsListening(true);
      
      // Load the model weights and architecture from your URL
      const recognizer = speechCommands.create(
        "BROWSER_FFT", 
        undefined, 
        URL + "model.json", 
        URL + "metadata.json"
      );
      
      // Wait for the neural network to download and compile in the browser
      await recognizer.ensureModelLoaded();
      recognizerRef.current = recognizer;

      // Extract the exact categories you created (e.g., ["Background Noise", "Doorbell"])
      const classLabels = recognizer.wordLabels();
      
      // Start the AI listening loop
      recognizer.listen(result => {
        // Find which array index represents your doorbell. 
        // IMPORTANT: If you named your class something other than "Doorbell" (like "Class 2"), change the word below!
        const doorbellIndex = classLabels.findIndex(label => label.toLowerCase() === "doorbell");
        
        if (doorbellIndex !== -1) {
          // Get the probability score (0.0 to 1.0)
          const doorbellProbability = result.scores[doorbellIndex] as number;
          
          // Convert to a percentage so we can see it in the UI
          setConfidence(Math.round(doorbellProbability * 100));

          // Our new "Pattern" Threshold: If the AI is 85% sure it heard a doorbell...
          if (doorbellProbability > 0.5) {
             setIsAlarming(true);
          }
        }
      }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.0,
        invokeCallbackOnNoiseAndUnknown: true,
        overlapFactor: 0.50 // Checks the audio stream rapidly
      });

    } catch (err) {
      console.error("AI Model failed to load. Check your internet connection.", err);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    if (recognizerRef.current) {
       await recognizerRef.current.stopListening();
    }
    setIsListening(false);
    setIsAlarming(false);
    setConfidence(0);
  };

  return { isListening, isAlarming, startListening, stopListening, confidence };
}