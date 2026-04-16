/**
 * Library of Master Plans for Olympia Gym
 * Goals: perder_peso, musculo, resistencia, mantener, rendimiento
 * Preferences: carnivoro, celiaco, vegetariano, vegano
 */

export const DIET_TEMPLATES = {
  perder_peso: {
    title: "Plan de Definición y Quema de Grasa",
    carnivoro: {
      desayuno: "Omelette de 3 claras y 1 huevo entero con espinaca. Café solo o con chorrito de leche descremada.",
      almuerzo: "200g de pechuga de pollo a la plancha con ensalada verde (lechuga, pepino, espárragos).",
      merienda: "Batido de proteína en agua o 1 yogur griego natural.",
      cena: "150g de merluza o lenguado al horno con brócoli al vapor. {{protein_info}}"
    },
    celiaco: {
      desayuno: "Galletas de arroz con palta y huevo poché. Fruta de estación.",
      almuerzo: "Bife de cuadril magro con mix de hojas verdes y tomates cherry. Sin harinas.",
      merienda: "Frutos secos (un puñado) y una manzana.",
      cena: "Pechuga de pollo con calabaza asada (porción moderada)."
    },
    vegetariano: {
      desayuno: "Yogur griego con granola sin azúcar y arándanos.",
      almuerzo: "Ensalada de legumbres (lentejas o garbanzos) con huevo duro, tomate y cebolla.",
      merienda: "Queso magro con rodajas de tomate y albahaca.",
      cena: "Wok de vegetales con tofu o cubos de queso port salut light."
    },
    vegano: {
      desayuno: "Tostadas de pan integral (chequear gluten si aplica) con hummus y semillas de chía.",
      almuerzo: "Quinoa con vegetales salteados y palta.",
      merienda: "Fruta con mantequilla de maní natural.",
      cena: "Hamburguesas de lentejas hechas en casa con ensalada de rúcula y rabanitos."
    }
  },
  musculo: {
    title: "Plan de Hipertrofia y Volumen Limpio",
    carnivoro: {
      desayuno: "Licuado de avena, banana, leche entera y 2 scoops de proteína. 2 tostadas con huevo.",
      almuerzo: "250g de carne roja magra (peceto/lomo) con 1 taza de arroz integral o batata.",
      merienda: "Sándwich de pollo y queso en pan integral.",
      cena: "200g de pollo o cerdo con puré de calabaza y 1 huevo duro. {{protein_info}}"
    },
    celiaco: {
      desayuno: "Avena certificada sin TACC con leche y banana. Tortilla de claras.",
      almuerzo: "Arroz yamani con carne trozada y vegetales.",
      merienda: "Yogur sin tacc con mix de nueces y almendras.",
      cena: "Salmón o pescado blanco con papas al horno. {{protein_info}}"
    },
    vegetariano: {
      desayuno: "Tortilla de 3 huevos con avena y miel. Jugo de naranja.",
      almuerzo: "Pasta integral con boloñesa de soja textualizada o lentejas y mucho queso rallado.",
      merienda: "Licuado proteico con leche y frutos rojos.",
      cena: "Milanesas de soja o berenjena con puré de papas y huevo revuelto."
    },
    vegano: {
      desayuno: "Tofu revuelto con cúrcuma sobre pan de masa madre. Batido de leche de soja.",
      almuerzo: "Guiso de lentejas y arroz con levadura nutricional y vegetales.",
      merienda: "Porción de brownie vegano casero (datiles y cacao) y nueces.",
      cena: "Seitán salteado con vegetales y batatas asadas."
    }
  },
  resistencia: {
    title: "Plan de Energía y Resistencia",
    carnivoro: {
      desayuno: "Tostadas con miel, queso crema y jamón cocido magro. Té verde.",
      almuerzo: "Pasta mediana con salsa de tomate natural y carne picada magra.",
      merienda: "Banana con yogurt y granola.",
      cena: "Pollo a la mostaza con arroz blanco y ensalada mixta."
    },
    // Fallbacks para simplificar
  }
};

// Rutinas base por objetivo
export const ROUTINE_TEMPLATES = {
  perder_peso: {
    title: "Circuito Quema Grasa - Spartan Metabolic",
    days: {
      Lunes: [
        { id: 'pp1', name: 'Burpees', series: '4', reps: '15', rest: '30s' },
        { id: 'pp2', name: 'Sentadillas con salto', series: '4', reps: '20', rest: '30s' },
        { id: 'pp3', name: 'Mountain Climbers', series: '4', reps: '40s', rest: '30s' },
        { id: 'pp4', name: 'Plancha Abdominal', series: '4', reps: '60s', rest: '45s' }
      ],
      Martes: [
        { id: 'pp5', name: 'Correr en cinta (Intervalos)', series: '5', reps: '2 min rápido / 1 min lento', rest: '-' },
        { id: 'pp6', name: 'Saltos a la soga', series: '4', reps: '1 min', rest: '30s' }
      ],
      Miércoles: [
         { id: 'pp7', name: 'Zancadas alternas', series: '4', reps: '20 tot', rest: '30s' },
         { id: 'pp8', name: 'Flexiones de brazos', series: '4', reps: 'MAX', rest: '45s' },
         { id: 'pp9', name: 'Jumping Jacks', series: '4', reps: '50', rest: '30s' }
      ],
      Jueves: [
        { id: 'pp10', name: 'Remo con mancuerna', series: '4', reps: '15', rest: '45s' },
        { id: 'pp11', name: 'Press militar mancuerna', series: '4', reps: '12', rest: '45s' }
      ],
      Viernes: [
        { id: 'pp12', name: 'Circuito Full Body', series: '3', reps: '15 reps cada ej', rest: '90s al final' }
      ],
      Sábado: [
        { id: 'pp13', name: 'Trote suave o Caminata', series: '1', reps: '45 min', rest: '-' }
      ]
    }
  },
  musculo: {
    title: "Hipertrofia - Fuerza y Volumen",
    days: {
      Lunes: [
        { id: 'm1', name: 'Press de Banca Plano', series: '4', reps: '8-10', rest: '90s' },
        { id: 'm2', name: 'Aperturas con mancuerna', series: '3', reps: '12', rest: '60s' },
        { id: 'm3', name: 'Press Militar', series: '4', reps: '10', rest: '90s' },
        { id: 'm4', name: 'Laterales hombros', series: '3', reps: '15', rest: '60s' }
      ],
      Martes: [
        { id: 'm5', name: 'Peso Muerto', series: '4', reps: '6-8', rest: '120s' },
        { id: 'm6', name: 'Remo con barra', series: '4', reps: '10', rest: '90s' },
        { id: 'm7', name: 'Dominadas o Jalón polea', series: '3', reps: '10-12', rest: '90s' },
        { id: 'm8', name: 'Curl de bíceps barra', series: '3', reps: '12', rest: '60s' }
      ],
      Miércoles: [
        { id: 'm9', name: 'Sentadilla barra libre', series: '4', reps: '8-10', rest: '120s' },
        { id: 'm10', name: 'Prensa 45°', series: '3', reps: '12', rest: '90s' },
        { id: 'm11', name: 'Estocadas con peso', series: '3', reps: '10 por pierna', rest: '60s' },
        { id: 'm12', name: 'Gemelos de pie', series: '4', reps: '15', rest: '60s' }
      ],
      Jueves: [
        { id: 'm13', name: 'Press Inclinado mancuerna', series: '4', reps: '10', rest: '90s' },
        { id: 'm14', name: 'Fondos paralelas', series: '3', reps: 'MAX', rest: '90s' },
        { id: 'm15', name: 'Tríceps polea soga', series: '3', reps: '15', rest: '60s' }
      ],
      Viernes: [
        { id: 'm16', name: 'Remo Kroc con mancuerna', series: '3', reps: '15', rest: '60s' },
        { id: 'm17', name: 'Chin ups', series: '3', reps: 'MAX', rest: '90s' },
        { id: 'm18', name: 'Concentrado bíceps', series: '3', reps: '12', rest: '60s' }
      ],
      Sábado: [
        { id: 'm19', name: 'Abdominales core', series: '4', reps: '20', rest: '45s' },
        { id: 'm20', name: 'Espinales', series: '4', reps: '15', rest: '45s' }
      ]
    }
  }
};

// Funccion para obtener el cálculo personalizado de macronutrientes simplificado
export const calculateNutrients = (profile) => {
  const weight = parseFloat(profile.weight) || 70;
  const goal = profile.goal || 'mantener';
  
  let protein = weight * 1.8; // Base 1.8g/kg
  let fats = weight * 0.8;
  
  if (goal === 'musculo') {
    protein = weight * 2.2;
  } else if (goal === 'perder_peso') {
    protein = weight * 2.0;
  }
  
  return {
    protein: Math.round(protein),
    fats: Math.round(fats),
    carbs: goal === 'musculo' ? weight * 4.5 : weight * 2.5
  };
};

/**
 * Procesa un texto de plan alimenticio inyectando datos del perfil
 */
export const processDietText = (text, profile) => {
  if (!text) return "";
  const nutrients = calculateNutrients(profile);
  
  return text.replace(/{{protein_info}}/g, 
    `Tu requerimiento diario estimado para tu objetivo es de ${nutrients.protein}g de proteína.`);
};
