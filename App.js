import React, {useEffect, useState} from 'react';
import{
  MenuItem,
  FormControl,
  Select,
} from "@material-ui/core";
import './App.css';
import InfoBox from './InfoBox';
import {Card , CardContent , Typography} from "@material-ui/core";
import Table from './Table';
import { sortData } from "./util";


function App() {
  const [countries, setCountries]=useState([ ]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] =useState([]);

  useEffect(()  =>  {
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response) => response.json())
    .then((data)  =>  {
      setCountryInfo(data);
    });
  }, []);

  useEffect(()  =>  { 
    const getCountriesData = async ()  => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setCountries(countries);
      });
        };

    getCountriesData();
  }, []);
  const onCountryChange = async (event) =>{
      const countryCode = event.target.value;
      setCountry(countryCode);
      const url = countryCode ==='worldwide'? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
   
   
      await fetch(url)
      .then (response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        
      });
    };

  return (
    <div className="App">
      <div className="App_left">
      <div className="app__header">
      <h1>Covid-19 Traker</h1>
      <FormControl className="app__dropdown">
        <Select varient="outlined" onChange={onCountryChange}  value={country}>
          <MenuItem value="worldwide">Worldwide</MenuItem>

            {
              countries.map(country=>(
              <MenuItem value={country.value}>{country.name}</MenuItem>
              ))
            }
          </Select>

      </FormControl>
      </div>


      <div className="app_stats">

      <InfoBox title="coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}>
      </InfoBox>

      <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered}>
      </InfoBox>

      <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}>
      </InfoBox>

      </div>
      </div>
          
      <Card className="app_right">
            <CardContent>
              <h3>Live Cases by Country</h3>
              <Table countries={tableData}>

              </Table>
              <h3>
                Worldwide new cases
              </h3>
              
            </CardContent>
      </Card >




    </div>
  );
}

export default App;