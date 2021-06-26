import React, { Component } from "react";
import { URLConfig } from "../../data/ApiUtils";
import { UserData } from "../../data/UserData";
import "./Home.css";
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import {withStyles} from '@material-ui/core/styles';
import FavoriteIconBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIconFill from '@material-ui/icons/Favorite';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

class Home extends Component {
    constructor(props) {
        super(props);
        if (sessionStorage.getItem('access-token') == null) {
            props.history.replace('/');
        }

        this.state = {
            profilePicture: null,
            mediaData: [],
            filteredData: [],
            userData: {},
            likeSet: new Set(),
            comments: {},
            currrentComment: ""
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
                filteredData: jsonResponse.data,
            });
        }).catch((error) => {
            console.log('error media data', error);
        });
    }

    componentDidMount() {
        this.getMediaData();
    }

    onSearchEntered = (value) => {
        console.log('search value', value);
        let filteredData = this.state.mediaData;
        filteredData = filteredData.filter((data) => {
            let string = data.caption.toLowerCase();
            let subString = value.toLowerCase();
            return string.includes(subString);
        })
        this.setState({
            filteredData
        })
    }

    likeClickHandler = (id) => {
        console.log('like id', id);
        var foundItem = this.state.mediaData.find((item) => {
            return item.id === id;
        })

        if (typeof foundItem !== undefined) {
            if (!this.state.likeSet.has(id)) {
                foundItem.likes.count++;
                this.setState(({ likeSet }) => ({
                    likeSet: new Set(likeSet.add(id))
                }))
            } else {
                foundItem.likes.count--;
                this.setState(({ likeSet }) => {
                    const newLike = new Set(likeSet);
                    newLike.delete(id);

                    return {
                        likeSet: newLike
                    };
                });
            }
        }
    }

    addCommentClickHandler = (id) => {
        if (this.state.currentComment === "" || typeof this.state.currentComment === undefined) {
            return;
        }

        let commentList = this.state.comments.hasOwnProperty(id) ?
            this.state.comments[id].concat(this.state.currentComment) : [].concat(this.state.currentComment);

        this.setState({
            comments: {
                ...this.state.comments,
                [id]: commentList
            },
            currentComment: ''
        })
    }


    commentChangeHandler = (e) => {
        this.setState({
            currentComment: e.target.value
        });
    }

    logout = () => {
        sessionStorage.clear();
        this.props.history.replace('/');
    }

    navigateToAccount = () => {
        this.props.history.push('/profile');
    }

    render() {
        return (
            <div>
                <Header
                    userProfileUrl={UserData.profileImageUrl}
                    screen={"Home"}
                    searchHandler={this.onSearchEntered}
                    handleLogout={this.logout}
                    handleAccount={this.navigateToAccount} />
                <div className={"grid"}>
                    <GridList className={"gridList"} cellHeight={'auto'}>
                        {this.state.filteredData.map(item => (
                            <GridListTile key={item.id}>
                                <HomeItem
                                    item={item}
                                    profilePicture={this.state.profilePicture}
                                    onLikedClicked={this.likeClickHandler}
                                    onAddCommentClicked={this.addCommentClickHandler}
                                    commentChangeHandler={this.commentChangeHandler}
                                    comments={this.state.comments} />
                            </GridListTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

class HomeItem extends Component {
    constructor() {
        super();
        this.state = {
            isLiked: false,
            comment: '',
        }
    }

    render() {
        const { item, comments, profilePicture } = this.props;

        let time = item.timestamp;
        let hashTags = UserData.hashTags;
        item.likes = {
            count: 10
        }
        return (
            <div className="home-item-main-container">
                <Card className={"card"}>
                    <CardHeader
                        avatar={
                            <Avatar alt="User Profile Pic" src={profilePicture} className={"avatar"} />
                        }
                        title={item.username}
                        subheader={time}
                    />
                    <CardContent>
                        <CardMedia
                            className={"media"}
                            image={item.media_url}
                            title={item.caption}
                        />
                        <div className={"hr"}>
                            <Typography component="p">
                                {item.caption}
                            </Typography>
                            <Typography style={{ color: '#4dabf5' }} component="p" >
                                {hashTags.join(' ')}
                            </Typography>
                        </div>
                    </CardContent>

                    <CardActions>
                        <IconButton aria-label="Add to favorites" onClick={this.onLikeClicked.bind(this, item.id)}>
                            {this.state.isLiked && <FavoriteIconFill style={{ color: '#F44336' }} />}
                            {!this.state.isLiked && <FavoriteIconBorder />}
                        </IconButton>
                        <Typography component="p">
                            {item.likes.count} Likes
                        </Typography>
                    </CardActions>

                    <CardContent>
                        {comments.hasOwnProperty(item.id) && comments[item.id].map((comment, index) => {
                            return (
                                <div key={index} className="row">
                                    <Typography component="p" style={{ fontWeight: 'bold' }}>
                                        {sessionStorage.getItem('username')}:
                                    </Typography>
                                    <Typography component="p" >
                                        {comment}
                                    </Typography>
                                </div>
                            )
                        })}
                        <div className={"formControl"}>
                            <FormControl style={{ flexGrow: 1, paddingRight: '10px' }}>
                                <InputLabel htmlFor="comment">Add Comment</InputLabel>
                                <Input id="comment" value={this.state.comment} onChange={this.commentChangeHandler} />
                            </FormControl>
                            <FormControl>
                                <Button onClick={this.onAddCommentClicked.bind(this, item.id)}
                                    variant="contained" color="primary">
                                    ADD
                                </Button>
                            </FormControl>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    onLikeClicked = (id) => {
        if (this.state.isLiked) {
            this.setState({
                isLiked: false
            });
        } else {
            this.setState({
                isLiked: true
            });
        }
        this.props.onLikedClicked(id)
    }

    commentChangeHandler = (e) => {
        this.setState({
            comment: e.target.value,
        });
        this.props.commentChangeHandler(e);
    }

    onAddCommentClicked = (id) => {
        if (this.state.comment === "" || typeof this.state.comment === undefined) {
            return;
        }
        this.setState({
            comment: ""
        });
        this.props.onAddCommentClicked(id);
    }
}

export default Home;