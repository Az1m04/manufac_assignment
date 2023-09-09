import React, { useState, useEffect } from "react";
import {
  calculateMean,
  calculateMedian,
  calculateMode,
} from "./Components/utilityFunction";
import wineData from "./Config/Wine-Data.json"; // Import wine data from JSON file

type WineDataProps = {
  Alcohol: number | string;
  "Malic Acid": number | string;
  Ash: number | string;
  "Alcalinity of ash": number | string;
  Magnesium: number | string;
  "Total phenols": number | string;
  Flavanoids: number | string;
  "Nonflavanoid phenols": number | string;
  Proanthocyanins: string;
  "Color intensity": number | string;
  Hue: number | string;
  "OD280/OD315 of diluted wines": number | string;
  Unknown: number | string;
};

interface ClassProps {
  [key: number]: { mean: number; median: number; mode: number };
}

interface GammaProps {
  [key: number]: { mean: number; median: number; mode: number };
}

type WineDataPropsWithGamma = WineDataProps & { Gamma?: number };

const parseFloatWithFallback = (value: number | string): number => {
  try {
    return parseFloat(value as string);
  } catch (error) {
    return 0;
  }
};

const App: React.FC = () => {
  const [classStatistics, setClassStatistics] = useState<ClassProps>({}); //flavanoids statistics state
  const [gamaStatistics, setGamaStatistics] = useState<GammaProps>({});  //gama statistics state
  const [error, setError] = useState<string | null>(null); // Add an error state

  const calculateGamma = (wine: WineDataProps): WineDataPropsWithGamma => {
    const ash = parseFloatWithFallback(wine.Ash);
    const hue = parseFloatWithFallback(wine.Hue);
    const magnesium = parseFloatWithFallback(wine.Magnesium);

    const gamma = (ash * hue) / magnesium || 0;

    return { ...wine, Gamma: gamma };
  };

  useEffect(() => {
    try {

      //Get the wine dataset
      if (!wineData || wineData.length === 0) {
        setError("Wine data not found."); 
        return;
      }

      // Group wine data by Alcohol class
      const groupedData: { [key: number]: WineDataProps[] } = {};
    
      wineData?.length>0  &&  wineData?.forEach((wine) => {
        const alcoholClass = wine.Alcohol;
        if (!groupedData[alcoholClass]) {
          groupedData[alcoholClass] = [];
        }
        groupedData[alcoholClass].push(wine);
      });

      // Calculate class statistics
      const classStats: ClassProps = {};
      for (const alcoholClass in groupedData) {
        const flavanoidsData = groupedData[parseFloat(alcoholClass)].map(
          (wine) => parseFloatWithFallback(wine.Flavanoids)
        );

        const mean = calculateMean(flavanoidsData);
        const median = calculateMedian(flavanoidsData);
        const mode = calculateMode(flavanoidsData);

        classStats[alcoholClass] = {
          mean: mean,
          median: median,
          mode: mode,
        };
      }

      setClassStatistics(classStats);

      // Calculate Gamma
      const dataWithGamma = wineData.map(calculateGamma);
      const groupedDataGamma: { [key: number]: WineDataPropsWithGamma[] } = {};

      dataWithGamma.forEach((wine) => {
        const alcoholClass = wine.Alcohol as number;
        if (!groupedDataGamma[alcoholClass]) {
          groupedDataGamma[alcoholClass] = [];
        }
        groupedDataGamma[alcoholClass].push(wine);
      });

      // Calculate statistics for each class
      const gammaStats: GammaProps = {};
      for (const alcoholClass in groupedDataGamma) {
        const gammaData = groupedDataGamma[parseFloat(alcoholClass)].map(
          (wine) => wine.Gamma as number
        );

        const mean = calculateMean(gammaData);
        const median = calculateMedian(gammaData);
        const mode = calculateMode(gammaData);

        gammaStats[alcoholClass] = {
          mean: mean,
          median: median,
          mode: mode,
        };
      }

      setGamaStatistics(gammaStats);
    } catch (err: any) {
      setError("An error occurred.");
      console.log("Error :", err.message);
    }
  }, []);

  const classes = Object.keys(gamaStatistics).map(Number); // Header for each class


 //Error handling if winData not found
  if (error) {
    return (
      <div className="App">
        <p>{error}</p>
      </div>
    );
  }

  //wine data is loaded 
  return (
    <div className="App">
      <div className="classes">
        <h2>Class-Wise Flavanoids Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {classes.map((classNum) => (
                <th key={classNum}>Class {classNum}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="stats"> Flavanoids <br/> Mean</td>
              {classes.map((classNum) => (
                <td key={classNum}>
                  {classStatistics[classNum].mean.toFixed(3)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="stats">Flavanoids <br/> Median</td>
              {classes.map((classNum) => (
                <td key={classNum}>
                  {classStatistics[classNum].median.toFixed(3)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="stats"> Flavanoids <br/> Mode</td>
              {classes.map((classNum) => (
                <td key={classNum}>
                  {classStatistics[classNum].mode.toFixed(3)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="classes">
        <h2>Class-Wise Gamma Statistics</h2>
        <table>
          <thead>
            <tr>
              <th>Measure</th>
              {classes.map((classNum) => (
                <th key={classNum}>Class {classNum}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="stats">Gamma <br/> Mean</td>
              {classes.map((classNum) => (
                <td key={classNum}>
                  {gamaStatistics[classNum].mean.toFixed(3)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="stats">Gamma <br/> Median</td>
              {classes.map((classNum) => (
                <td key={classNum}>
                  {gamaStatistics[classNum].median.toFixed(3)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="stats">Gamma <br/> Mode</td>
              {classes.map((classNum) => (
                <td key={classNum}>
                  {gamaStatistics[classNum].mode.toFixed(3)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
