const SomeApp = {
    data() {
        return{
            referee: {},
            assignment: {},
            game: {},
            selectedRole: null,
            roles: {},
            selectedGame: null,
            assignmentForm: {},
            selectedReferee: null,
            refereeForm: {},
            gameForm: {},
            selectedAssignment: null
        }
    },
    computed: {

    },
    methods: {
        fetchRefereeData() {
            fetch('/api/referee/index.php')
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.referee = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
        },
        fetchRoleData() {
            fetch('/api/roles/index.php')
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.roles = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
        },
        fetchAssignmentData(a) {
            console.log("Fetching assignment data for ", a);
            fetch('/api/assignment/?game=' + a.id)
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.assignment = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
            .catch( (error) => {
                console.error(error);
            });
        },
        fetchGameData()
        {
            fetch('/api/game/index.php')
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.game = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
        },
        selectGame(g) {
            if (g == this.selectedGame) {
                return;
            }
            this.selectedGame = g;
            this.assignment = [];
            this.fetchAssignmentData(this.selectedGame);
        },
        postNewAssignment(evt) {
            this.assignmentForm.gameAssignmentId = this.selectedGame.id;

            fetch('api/assignment/create.php', {
                method:'POST',
                body: JSON.stringify(this.assignmentForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
            })
            .then( response => response.json() )
            .then( json => {
                console.log("Returned from post", json);
                this.assignment = json;
                this.assignmentForm={};
            });
        },
        selectRole(r) {
            if (r == this.selectedRole) {
                return;
            }
            this.selectedRole = r;
            this.referee = [];
            this.fetchRefereeData();
            this.fetchGameData();
            // this.fetchAssignmentData();
            // this.bookForm = Object.assign({}, this.selectedBook);
        },
        selectRefereeToEdit(o) {
            this.selectedReferee = o;
            this.refereeForm = Object.assign({}, this.selectedReferee);
        },
        postDeleteReferee(o) {
            if (!confirm("Are you sure you want to delete "+o.firstName+"?")) {
              return;
            }
            console.log("Delete!", o);
    
            fetch('api/referee/delete.php', {
                method:'POST',
                body: JSON.stringify(o),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.referee = json;
    
                // reset the form
                this.resetRefereeForm();
              });
          },
          postReferee(evt) {
            if (this.selectedReferee === null) {
                this.postNewReferee(evt);
            } else {
                this.postEditReferee(evt);
            }
          },
          postNewReferee(evt) {
    
            console.log("Creating!", this.refereeForm);
    
            fetch('api/referee/create.php', {
                method:'POST',
                body: JSON.stringify(this.refereeForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.referee = json;
    
                // reset the form
                this.resetRefereeForm();
              })
              .catch( err => {
                alert("Something went horribly wrong!");
              });
          },
          postEditReferee(evt) {
            this.refereeForm.id = this.selectedReferee.id;
    
            console.log("Updating!", this.refereeForm);
    
            fetch('api/referee/update.php', {
                method:'POST',
                body: JSON.stringify(this.refereeForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.referee = json;
    
                // reset the form
                this.resetRefereeForm();
              });
        },
        resetRefereeForm() {
            this.selectedReferee = null;
            this.refereeForm = {};
        },
        selectGameToEdit(o) {
            this.selectedGame = o;
            this.gameForm = Object.assign({}, this.selectedGame);
        },
        postDeleteGame(o) {
            if (!confirm("Are you sure you want to delete?")) {
              return;
            }
            console.log("Delete!", o);
    
            fetch('api/game/delete.php', {
                method:'POST',
                body: JSON.stringify(o),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.referee = json;
    
                // reset the form
                this.resetGameForm();
              });
          },
          postGame(evt) {
            if (this.selectedGame === null) {
                this.postNewGame(evt);
            } else {
                this.postEditGame(evt);
            }
          },
          postNewGame(evt) {
    
            console.log("Creating!", this.gameForm);
    
            fetch('api/game/create.php', {
                method:'POST',
                body: JSON.stringify(this.gameForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.game = json;
    
                // reset the form
                this.resetGameForm();
              })
              .catch( err => {
                alert("Something went horribly wrong!");
              });
          },
          postEditGame(evt) {
            this.gameForm.id = this.selectedGame.id;
    
            console.log("Updating!", this.gameForm);
    
            fetch('api/game/update.php', {
                method:'POST',
                body: JSON.stringify(this.gameForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.game = json;
    
                // reset the form
                this.resetGameForm();
              });
          },
          resetGameForm() {
            this.selectedGame = null;
            this.gameForm = {};
        },
        // selectAssignment(a) {
        //     if (a == this.selectedAssignment) {
        //         return;
        //     }
        //     this.selectedAssignment = a;
        //     this.assignment = [];
        //     this.fetchAssignmentData(this.selectedGame);
        // },
        postDeleteAssignment(o) {
            if (!confirm("Are you sure you want to delete?")) {
              return;
            }
            console.log("Delete!", o);
    
            fetch('api/assignment/delete.php', {
                method:'POST',
                body: JSON.stringify(o),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.assignment = json;
    
                // reset the form
                this.resetAssignmentForm();
              });
          },
          postAssignment(evt) {
            if (this.selectedAssignment === null) {
                this.postNewAssignment(evt);
            } else {
                this.postEditAssignment(evt);
            }
          },
          postEditAssignment(evt) {
            // this.AssignmentForm.id = this.selectedAssignment.id;
    
            console.log("Updating!", this.assignmentForm);
    
            fetch('api/assignment/update.php', {
                method:'POST',
                body: JSON.stringify(this.assignmentForm),
                headers: {
                  "Content-Type": "application/json; charset=utf-8"
                }
              })
              .then( response => response.json() )
              .then( json => {
                console.log("Returned from post:", json);
                // TODO: test a result was returned!
                this.assignment = json;
    
                // reset the form
                this.resetAssignmentForm();
              });
        },
        selectAssignmentToEdit(o) {
            this.selectedAssignment = o;
            this.assignmentForm = Object.assign({}, this.selectedAssignment);
        },
        resetAssignmentForm() {
            this.selectedAssignment = null;
            this.AssignmentSForm = {};
        },
    },
    created() {
        // this.fetchGameData();
        this.fetchRoleData();
}
}

Vue.createApp(SomeApp).mount('#someApp');