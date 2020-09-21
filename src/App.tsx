import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css';

// define types 
type QRColor = "Blue" | "Green";

type CallToAction = "Scan Here" | "Point. Aim. Shoot";

type PermutationData = {
  id: string,
  last_modified: Date,
  time_stamp: Date,
  name: string,
  brand: string[],
  campaign: string,
  variables: [
    QRColor,
    CallToAction,
  ]
}

// other components
const Permutation: React.FC<{ data: PermutationData, handleSelect: Function, isSelected: boolean }> = (props) => {
  const [selected, setSelected] = React.useState(false);

  useEffect(() => {
    setSelected(props.isSelected);
  }, [props.isSelected]);

  return (
    <div 
      className="permutation" 
      onClick={() => props.handleSelect(props.data)} 
      style={{
        color: selected ? 'white' : 'black', 
        backgroundColor: selected ? props.data.variables[0] : 'white',
        borderColor: props.data.variables[0],
        borderWidth: 1,
        borderStyle: 'solid',
      }}
    >
      <div className="brand">{props.data.brand}</div>
      <div className="cta">{props.data.variables[1]}</div>
    </div>
  );
};

const SelectedPermutation: React.FC<{ data: PermutationData}> = (props) => {
  return (
    <div 
      className="permutation" 
      style={{
        color: 'white', 
        backgroundColor: props.data.variables[0],
      }}
    >
      <div className="brand">{props.data.brand}</div>
      <div className="cta">{props.data.variables[1]}</div>
    </div>
  );
};

const Campaign: React.FC<{ selectedData: PermutationData[]}> = (props) => {
  const renderSelected = (selectedData: PermutationData[]) => {
    if (selectedData.length === 0) {
      return (
        <div className="error">None selected.</div>
      );
    } 
    return selectedData.map((data) => {
      return (
        <SelectedPermutation key={data.id} data={data}/>
      );
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3> Permutation Wizard</h3>
      </header>
      <div className="permutations-container">
        {renderSelected(props.selectedData)}
        <div className="buttons-container">
          <Link to="/"><button>Back</button></Link>
        </div>
      </div>
    </div>
  );
};

// main component
const App: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [selectedUuids, setSelectedUuids] = React.useState([] as string[]);
  const [selectedData, setSelectedData] = React.useState([] as PermutationData[]);

  useEffect(() => {
    fetch("https://flowcode.com/mock-api-data", {mode: 'cors'})
    .then(res => res.json())
    .then(
      (result) => setData(result),
    )
  }, []);

  const handleSelect = (data: PermutationData) => {
    let newSelectedUuids = [...selectedUuids];
    let newSelectedData = [...selectedData];
    if (newSelectedUuids.includes(data.id)) {
      const idx = newSelectedUuids.indexOf(data.id);
      newSelectedUuids.splice(idx, 1);
      newSelectedData.splice(idx,1);
    } else {
      newSelectedUuids.push(data.id);
      newSelectedData.push(data);
    }
    setSelectedUuids(newSelectedUuids);
    setSelectedData(newSelectedData);
  };

  const handleReset = () => {
    setSelectedUuids([]);
    setSelectedData([]);
  };

  const renderPermutations = () => {
    if (data.length === 0) {
      return (
        <div className="error">None found.</div>
      );
    }
    return data.map((permutation: PermutationData) => {
      const isSelected = selectedUuids.includes(permutation.id) ? true : false;
      return (
        <Permutation key={permutation.id} data={permutation} handleSelect={handleSelect} isSelected={isSelected}/>
      );
    });
  }

  const renderHome = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h3> Permutation Wizard</h3>
        </header>
        <div className="permutations-container">
          {renderPermutations()}
          <div className="buttons-container">
            <Link to="/campaign"><button>Confirm</button></Link>
            <button onClick={handleReset}>Reset</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Router>
      <Switch>
        <Route path="/" exact render={renderHome} />
        <Route path="/campaign" render={() => <Campaign selectedData={selectedData} />}/>
      </Switch>
    </Router>
  );
}

export default App;
