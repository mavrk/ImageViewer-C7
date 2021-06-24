import React, { Component } from "react";
import { URLConfig } from "../../data/ApiUtils";
import { UserData } from "../../data/UserData";
import './Profile.css';
import Header from '../../common/header/Header';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormHelperText from '@material-ui/core/FormHelperText';
import CardMedia from '@material-ui/core/CardMedia';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIconBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFill from '@material-ui/icons/Favorite';

const styles = {
    paper: {
        position: 'relative',
        width: "180px",
        backgroundColor: "#fff",
        top: "30%",
        margin: "0 auto",
        boxShadow: "2px 2px #888888",
        padding: "20px"
    },
    media: {
        height: '200px',
        paddingTop: '56.25%', // 16:9
    },
    imageModal: {
        backgroundColor: "#fff",
        margin: "0 auto",
        boxShadow: "2px 2px #888888",
        padding: "10px",
    }
};



class Profile extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }

        this.state = {
            profilePicture: null,
            username: null,
            fullName: null,
            posts: null,
            follows: null,
            followers: null,
            editOpen: false,
            fullNameRequired: 'dispNone',
            newFullName: '',
            mediaData: null,
            imageModalOpen: false,
            currentItem: null,
            likeSet: new Set(),
            comments: {},
        }
    }

    getMediaData = () => {
        let that = this;
        let url = `${URLConfig.allMediaUrl}&access_token=${sessionStorage.getItem('access-token')}`;
        fetch(url, {
            method: 'GET',
        }).then(response => response.json()
        ).then((jsonResponse) => {
            that.setState({
                profilePicture: UserData.profileImageUrl,
                username: sessionStorage.getItem('username'),
                fullName: UserData.fullName,
                followers: UserData.followers,
                follows: UserData.follows,
                mediaData: jsonResponse.data,
            });
        }).catch((error) => {
            console.log('error media data', error);
        });
    }

    componentDidMount() {
        this.getMediaData();
    }

    handleOpenEditModal = () => {
        this.setState({ editOpen: true });
    }

    handleCloseEditModal = () => {
        this.setState({ editOpen: false });
    }

    handleOpenImageModal = (event) => {
        var result = this.state.mediaData.find(item => {
            return item.id === event.target.id
        })
        console.log(result);
        this.setState({ imageModalOpen: true, currentItem: result });
    }

    handleCloseImageModal = () => {
        this.setState({ imageModalOpen: false });
    }

    inputFullNameChangeHandler = (e) => {
        this.setState({
            newFullName: e.target.value
        })
    }

    updateClickHandler = () => {
        if (this.state.newFullName === '') {
            this.setState({ fullNameRequired: 'dispBlock'})
        } else {
            this.setState({ fullNameRequired: 'dispNone' })
        }

        if (this.state.newFullName === "") { return }

        this.setState({
            full_name: this.state.newFullName
        })

        this.handleCloseEditModal()
    }

    likeClickHandler = (id) =>{
      console.log('like id',id);
      var foundItem = this.state.currentItem;

      if (typeof foundItem !== undefined) {
        if (!this.state.likeSet.has(id)) {
          foundItem.likes.count++;
          this.setState(({likeSet}) => ({
            likeSet:new Set(likeSet.add(id))
          }))
        }else {
          foundItem.likes.count--;
          this.setState(({likeSet}) =>{
            const newLike = new Set(likeSet);
            newLike.delete(id);

            return {
              likeSet:newLike
            };
          });
        }
      }
    }

    onAddCommentClicked = (id) => {
      console.log('id',id);
      if (this.state.currentComment === "" || typeof this.state.currentComment === undefined) {
        return;
      }

      let commentList = this.state.comments.hasOwnProperty(id)?
        this.state.comments[id].concat(this.state.currentComment): [].concat(this.state.currentComment);

      this.setState({
        comments:{
          ...this.state.comments,
          [id]:commentList
        },
        currentComment:''
      })
    }

    commentChangeHandler = (e) => {
      this.setState({
        currentComment:e.target.value
      });
    }

    logout = () => {
      sessionStorage.clear();
      this.props.history.replace('/');
    }

    render() {
        let mediaData = this.state.mediaData;
        let hashTags = [];
        return (
            <div>
                <Header
                  screen={"Profile"}
                  userProfileUrl={this.state.profilePicture}
                  handleLogout={this.logout}/>
                <div className="information-section">
                    <Avatar
                        alt="User Image"
                        src={this.state.profilePicture}
                        style={{width: "50px", height: "50px"}}
                    />
                    <span style={{marginLeft: "20px"}}>
                        <div style={{width: "600px", fontSize: "big"}}> {this.state.username} <br />
                            <div style={{float: "left", width: "200px", fontSize: "x-small"}}> Posts: {this.state.postsCount} </div>
                            <div style={{float: "left", width: "200px", fontSize: "x-small"}}> Follows: {this.state.follows} </div>
                            <div style={{float: "left", width: "200px", fontSize: "x-small"}}> Followed By: {this.state.followers}</div> <br />
                        </div>
                        <div style={{fontSize: "small"}}> {this.state.fullName}
                        <Button mini variant="fab" color="secondary" aria-label="Edit" style={{marginLeft: "20px"}} onClick={this.handleOpenEditModal}>
                            <EditIcon/>
                        </Button>
                        </div>
                        <Modal
                            aria-labelledby="edit-modal"
                            aria-describedby="modal to edit user full name"
                            open={this.state.editOpen}
                            onClose={this.handleCloseEditModal}
                            style={{alignItems: 'center', justifyContent: 'center'}}
                        >
                            <div style={styles.paper}>
                                <Typography variant="h5" id="modal-title">
                                    Edit
                                </Typography><br />
                                <FormControl required>
                                    <InputLabel htmlFor="fullname">Full Name</InputLabel>
                                    <Input id="fullname" onChange={this.inputFullNameChangeHandler} />
                                    <FormHelperText className={this.state.fullNameRequired}><span className="red">required</span></FormHelperText>
                                </FormControl><br /><br /><br />
                                <Button variant="contained" color="primary" onClick={this.updateClickHandler}>
                                    UPDATE
                                </Button>
                            </div>
                        </Modal>
                    </span>
                </div>
                {this.state.mediaData != null &&
                    <GridList cellHeight={'auto'} cols={3} style={{ padding: "40px" }}>
                        {mediaData && mediaData.map(media => (
                            <GridListTile key={media.id} style={{cursor: "pointer"}}>
                                <CardMedia
                                    id={media.id}
                                    image={media.media_url}
                                    title={media.caption}
                                    style={styles.media}
                                    onClick={this.handleOpenImageModal}
                                />
                            </GridListTile>
                        ))}

                    </GridList>
                }
                {this.state.currentItem != null &&
                <Modal
                    aria-labelledby="image-modal"
                    aria-describedby="modal to show image details"
                    open={this.state.imageModalOpen}
                    onClose={this.handleCloseImageModal}
                    style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <div style={{display:'flex',flexDirection:'row',backgroundColor: "#fff",width:'70%',height:'70%'}}>
                      <div style={{width:'50%',padding:10}}>
                        <img style={{height:'100%',width:'100%'}}
                          src={this.state.currentItem.media_url}
                          alt={this.state.currentItem.caption} />
                      </div>

                      <div style={{display:'flex', flexDirection:'column', width:'50%', padding:10}}>
                        <div style={{borderBottom:'2px solid #f2f2f2',display:'flex', flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}}>
                          <Avatar
                            alt="User Image"
                            src={this.state.profilePicture}
                            style={{width: "50px", height: "50px",margin:'10px'}}/>
                            <Typography component="p">
                              {this.state.username}
                            </Typography>
                        </div>
                        <div style={{display:'flex', height:'100%', flexDirection:'column', justifyContent:'space-between'}}>
                          <div>
                            <Typography component="p">
                              {this.state.currentItem.caption}
                            </Typography>
                            <Typography style={{color:'#4dabf5'}} component="p" >
                              {hashTags.join(' ')}
                            </Typography>
                            {this.state.comments.hasOwnProperty(this.state.currentItem.id) && this.state.comments[this.state.currentItem.id].map((comment, index)=>{
                              return(
                                <div key={index} className="row">
                                  <Typography component="p" style={{fontWeight:'bold'}}>
                                    {sessionStorage.getItem('username')}:
                                  </Typography>
                                  <Typography component="p" >
                                    {comment}
                                  </Typography>
                                </div>
                              )
                            })}
                          </div>
                          <div>
                            <div className="row">
                              <IconButton aria-label="Add to favorites" onClick={this.likeClickHandler.bind(this,this.state.currentItem.id)}>
                                {this.state.likeSet.has(this.state.currentItem.id) && <FavoriteIconFill style={{color:'#F44336'}}/>}
                                {!this.state.likeSet.has(this.state.currentItem.id) && <FavoriteIconBorder/>}
                              </IconButton>
                              <Typography component="p">
                                5 Likes
                              </Typography>
                            </div>
                            <div className="row">
                              <FormControl style={{flexGrow:1}}>
                                <InputLabel htmlFor="comment">Add Comment</InputLabel>
                                <Input id="comment" value={this.state.currentComment} onChange={this.commentChangeHandler}/>
                              </FormControl>
                              <FormControl>
                                <Button onClick={this.onAddCommentClicked.bind(this,this.state.currentItem.id)}
                                   variant="contained" color="primary">
                                  ADD
                                </Button>
                              </FormControl>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                </Modal>}
            </div>
        );
    }
}

export default Profile;