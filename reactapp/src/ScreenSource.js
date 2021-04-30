import React,{useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import './App.css';
import { List, Avatar} from 'antd';
import Nav from './Nav'
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([])
  const [language, setLanguage] = useState(props.language);
  //const [language, setLanguage] = useState('fr');
  console.log('language3', language)
  useEffect( () => {
    const findLanguage = async () => {
      
      const reqFind = await fetch(`/user-language?token=${props.token}`);
      const respondeFind = await reqFind.json();
      console.log('respondeFind', respondeFind)
      setLanguage(respondeFind.lang)

    };
    findLanguage();

  }, []);

  useEffect(() => {
    const APIResultsLoading = async() => {
      let lang = 'fr';
      let country = 'fr';

      switch (language) {

        case 'en' :
            lang = 'en';
            country = 'us';
            break;
      };
      props.changeLanguage(language);
      const reqLang = await fetch('/user-language', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `lang=${lang}&token=${props.token}`
      });

      const data = await fetch(`https://newsapi.org/v2/sources?language=${lang}&country=${country}&apiKey=89dda5e59b344a2d8e5787e846aff07a`)
      const body = await data.json()
      setSourceList(body.sources)
    }

    APIResultsLoading()
  }, [language])

  var updateLang = async (lang) => {
    console.log('language1', language)
    setLanguage(lang)
    console.log('language2', language)

  };

  let contourLanguageFr = {width:'60px', margin:'10px',cursor:'pointer'};
  let contourLanguageEn = {width:'60px', margin:'10px',cursor:'pointer'};

  switch (language) {
    case 'fr' :

      if (language == 'fr'){
        contourLanguageFr.border = '1px solid black';
      };
  
    case 'en' :
      if (language == 'en'){
        contourLanguageEn.border = '1px solid black';
      };
  }

  return (
    <div>
        <Nav/>
      
        <div style={{justifyContent: 'center', display: 'flex'}} className="Banner">
          <img style={contourLanguageFr} src={'/images/fr.png'} onClick={() => updateLang ('fr')}/>
          <img style={contourLanguageEn} src={'/images/en.png'} onClick={() => updateLang ('en')}/>
        </div>

      <div className="HomeThemes">
          
              <List
                  itemLayout="horizontal"
                  dataSource={sourceList}
                  renderItem={(source, i) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={`/images/${source.category}.png`} />}
                        title={<Link to={`/screenarticlesbysource/${source.id}`} key={i}>{source.name}</Link>}
                        description={source.description}
                      />
                    </List.Item>
                  )}
                />


          </div>
    
      </div>
  );
}

function mapStateToProps(state) {
  return {
      language: state.language,token: state.token
    }
  };

function mapDispatchToProps(dispatch) {
  return {
      changeLanguage: function(language) {
      dispatch({ type: 'changeLanguage',
                language: language });
      }
    }
  };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenSource);
