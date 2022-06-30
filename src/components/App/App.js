import React from 'react';
import axios from 'axios';
import TeamMember from '../TeamMember';
import './App.css';
import NewMemberForm from '../NewMemberForm/NewMemberForm';
import AppHeader from '../AppHeader/AppHeader';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      team: [],
      loading: true,
      showNewMemberForm: false,
      sortMode:0
    };

  }

  async componentDidMount() {
    try {
      await this.fetchInitialData();
    } catch (error) {
      // try again after half a second if fails due to race condition
      console.log('retrying initial data request...');
      setTimeout(async () => {
        await this.fetchInitialData();
      }, 500);
    }
  }

  async fetchInitialData() {
    const response = await axios.get('/team');
    this.setState({
      team: response.data,
      loading: false,
      showNewMemberForm:false
    });
  }

  /**
   * Attempts to post the new team member data to the server.
   * @param {TeamMember} data 
   */
  async postNewMember(data) {
    const response = await axios.post('/member', data);
    
    // If successful, close the form and refresh the team member view
    if (response.status === 200) {
      this.closeNewMemberForm();
      this.setState({
        loading:true
      });
      this.fetchInitialData();
    }
  }

  closeNewMemberForm() {
    this.setState({showNewMemberForm:false});
  }
  showNewMemberForm() {
    this.setState({showNewMemberForm:true});
  }

  /**
   * Handles the sort selection option being changed. Will re-sort the team members based on the selection.
   * @param {Event} e 
   */
  handleSortChange(e) {
    const value = e.target.value;

    let sortedTeam = [...this.state.team];
    sortedTeam = sortedTeam.sort((a,b) => this.sortFunction(a, b, value));
    
    this.setState({
      sortMode:value,
      team:sortedTeam
    });
  }

  /**
   * Handles the different sorting options. Will return a positive value if a.* > b.* based on the sortMode.
   * @param {TeamMember} a 
   * @param {TeamMember} b 
   * @param {String} sortMode 
   * @returns 
   */
  sortFunction(a, b, sortMode) {
    const aLastName = a.lastName.toLowerCase();
    const bLastName = b.lastName.toLowerCase();
    let aTime = new Date(a.createdAt);
    let bTime = new Date(b.createdAt);
    // If members were made at essentially the same time (db seeding), then sort by their id number instead. assumes sequential ids.
    if (Math.abs(aTime - bTime) < 10) {
      aTime = a.id;
      bTime = b.id;
    }

    if (sortMode === "0") {                   // Sort by date joined (oldest first)
      return aTime - bTime;
    } else if (sortMode === "1") {            // Sort by date joined (newest first)
      return bTime - aTime;
    } else if (sortMode === "2") {
      return aLastName > bLastName ? 1 : -1;  // Sort by last name A-Z
    } else if (sortMode === "3") {
      return aLastName < bLastName ? 1 : -1;  // Sort by last name Z-A
    } else {
      return 0;
    }
  }

  render() {
    if (this.state.loading) {
      return <h1>Loading...</h1>;
    }

    let newMemberForm = null;
    if (this.state.showNewMemberForm) {
      newMemberForm = <NewMemberForm 
        close={() => {this.closeNewMemberForm();}}
        postNewMember={(d) => {this.postNewMember(d); }}
      />
    }

    return (
      <div className="app">
        <AppHeader handleSortChange={(e) => {this.handleSortChange(e); }}/>
        {newMemberForm}
        <div className="team-grid" />
        {this.state.team
          .map(member => (
            <TeamMember
              key={member.id}
              name={`${member.firstName} ${member.lastName}`}
              title={member.title}
              photoUrl={member.photoUrl}
              story={member.story}
              favoriteColor={member.favoriteColor}
            />
          ))
        }
        {/* Make this new team member link to your form! */}
        <TeamMember id="new" name="Join the team!" title="New Teammate" hasNewButton={true} openForm={() => {this.showNewMemberForm();}} />
      </div>
    );
  }
}

export default App;
