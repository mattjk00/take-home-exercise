import React from 'react';
import PropTypes from 'prop-types';
import './TeamMember.css';
import CodelitEmptyAvatar from '../../assets/codelit_empty_avatar.svg';

class TeamMember extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    photoUrl: PropTypes.string,
    story: PropTypes.string,
    favoriteColor: PropTypes.string,
    hasNewButton: PropTypes.bool,
    openForm: PropTypes.func
  };

  static defaultProps = {
    photoUrl: CodelitEmptyAvatar,
    story: null,
    favoriteColor: '#3466F2',
    hasNewButton:false
  };

  render() {

    // Render a button that will create a new team member if the prop hasNewButton is set to true
    let nameBlock = <h1 className="name">{this.props.name}</h1>
    if (this.props.hasNewButton) {
      nameBlock = <button className='newButton' onClick={this.props.openForm}>{this.props.name}</button>
    }

    return (
      <div className="container">
        <header>
          <div className="avatar-container">
            <img
              className="avatar"
              src={this.props.photoUrl}
              alt={this.props.name}
            />
          </div>
          <h2 className="title">{this.props.title}</h2>
          {nameBlock}
          
        </header>
        <div className="body">{this.props.story}</div>
        <footer style={{ backgroundColor: this.props.favoriteColor }}>
          <div className="full-width-flex-box">
            <div className="one-third-flex-box stat">9.0</div>
            <div className="one-third-flex-box stat bordered">9.0</div>
            <div className="one-third-flex-box stat">9.0</div>
          </div>
          <div className="full-width-flex-box">
            <div className="one-third-flex-box">CANDID</div>
            <div className="one-third-flex-box">LEARNING</div>
            <div className="one-third-flex-box">GRIT</div>
          </div>
        </footer>
      </div>
    );
  }
}

export default TeamMember;
