import React, {useState, useEffect} from 'react';
import './App.css';
import { Card, Icon, Modal} from 'antd';
import Nav from './Nav'

import {connect} from 'react-redux'

const { Meta } = Card;

function ScreenMyArticles(props) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [filtreLanguage, setFiltreLanguage] = useState('');

  useEffect(() => {
    console.log('useEffect filtre language')
    const findArticlesInWishlist = async() => {
      const wishlist = await fetch(`/wishlist-article?lang=${filtreLanguage}&token=${props.token}`);
      const wishlistResponse = await wishlist.json();

      props.saveArticle(wishlistResponse.articles);
      console.log('articles', wishlistResponse.articles);
    };
    findArticlesInWishlist();
  }, [filtreLanguage]);

  const deleteArticle = async (title) => {
    props.deleteFromWishlist(title);

    const deleteDB = await fetch('/wishlist-article', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body: `title=${title}&token=${props.token}`
    });
  };

  const filLanguage = (lang) => {
    setFiltreLanguage(lang);
  };
  // let filtreLang = []
  // let choixLang= filtreLang.filter()

  var showModal = (title, content) => {
    setVisible(true)
    setTitle(title)
    setContent(content)

  }

  var handleOk = e => {
    console.log(e)
    setVisible(false)
  }

  var handleCancel = e => {
    console.log(e)
    setVisible(false)
  }

  var noArticles
  if(props.myArticles.length == 0){
    noArticles = <div style={{marginTop:"70px"}}>No Articles</div>
  }

  return (
    <div>
        
            <Nav/>

            <div style={{justifyContent: 'center', display: 'flex'}} className="Banner">
              <img style={{width:'60px', margin:'10px',cursor:'pointer'}} src={'/images/fr.png'} onClick={() => filLanguage('fr')}/>
              <img style={{width:'60px', margin:'10px',cursor:'pointer'}} src={'/images/en.png'} onClick={() => filLanguage('en')}/>
            </div>

            <div className="Card">
    
              {noArticles}
            {props.myArticles.map((article,i) => (
                <div key={i} style={{display:'flex',justifyContent:'center'}}>

                  <Card
                    
                    style={{ 
                    width: 300, 
                    margin:'15px', 
                    display:'flex',
                    flexDirection: 'column',
                    justifyContent:'space-between' }}
                    cover={
                    <img
                        alt="example"
                        src={article.urlToImage}
                    />
                    }
                    actions={[
                        <Icon type="read" key="ellipsis2" onClick={() => showModal(article.title,article.content)} />,
                        <Icon type="delete" key="ellipsis" onClick={() => deleteArticle(article.title)}/>
                      ]}
                    >

                    <Meta
                      title={article.title}
                      description={article.description}
                    />

                  </Card>
                  <Modal
                    title={title}
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <p>{content}</p>
                  </Modal>

                </div>

              ))}

            </div>

      </div>
  );
}

function mapStateToProps(state){
  return {myArticles: state.wishList, token: state.token}
    }


    function mapDispatchToProps(dispatch) {
      return {
          deleteFromWishlist: function(title) {
          dispatch({ type: 'deleteArticle',
                    title: title });
          },
          saveArticle: function(articles) {
            dispatch({ type: 'saveArticle',
                      articles: articles })
          }
        }
      };


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScreenMyArticles);
