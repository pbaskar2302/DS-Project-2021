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
            selectedAssignment: null,
            pastGame: {},
            selectedRefereeDet: null,
            futureGame: {},
            assignDet: {},
            dateForm: {},
            unass: {},
            gamescnt: {}
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
        fetchPastGameData(r)
        {
            this.selectedRefereeDet= r;
            fetch('/api/assignment/fetchPast.php/?referee=' + r.id)
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.pastGame = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            })
        },
        fetchFutureGameData(r)
        {
            this.selectedRefereeDet= r;
            fetch('/api/assignment/fetchFuture.php/?referee=' + r.id)
            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.futureGame = responseJson;
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
            if ( this.assignment.length >= 4) {
              alert("4 referees have already been assigned to this game");
              return;
          }
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
        },
        selectRefereeToEdit(o) {
            this.selectedReferee = o;
            this.refereeForm = Object.assign({}, this.selectedReferee);
        },
        selectRef() {
            this.selectedRefereeDet= this.dateForm;
            fetch('/api/referee/fetchRef.php/?refereeAssignmentId=' + this.dateForm.refereeAssignmentId + '&startDate=' + this.dateForm.startDate + '&endDate=' + this.dateForm.endDate)

            .then( response => response.json() )
            .then( (responseJson) => {
                console.log(responseJson);
                this.assignDet = responseJson;
            })
            .catch( (err) => {
                console.error(err);
            });
        },
        postDeleteRefAssign(a)
        {
          if (!confirm("Are you sure you want to decline?")) {
            return;
          }
          console.log("Decline!", a);
  
          fetch('api/assignment/deleteRef.php', {
              method:'POST',
              body: JSON.stringify(a),
              headers: {
                "Content-Type": "application/json; charset=utf-8"
              }
            })
            .then( response => response.json() )
            .then( json => {
              console.log("Returned from post:", json);
              // TODO: test a result was returned!
              this.futureGame = json;
            })
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
                this.game = json;
    
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
        postDeleteAssignment(o) {
            if (!confirm("Are you sure you want to delete?")) {
              return;
            }
            console.log("Delete!", o);
    
            fetch('api/assignment/deleteGame.php', {
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
            this.assignmentForm = {};
        },

        fetchUnassignedData() {
          fetch('/api/game/fetchUnassigned.php')
          .then( response => response.json() )
          .then( (responseJson) => {
              console.log(responseJson);
              this.unass = responseJson;
          })
          .catch( (err) => {
              console.error(err);
          });
        },
        fetchNumberGame() {
          fetch('/api/game/fetchNumGames.php')
          .then( response => response.json() )
          .then( (responseJson) => {
              console.log(responseJson);
              this.gamescnt = responseJson;
          })
          .catch( (err) => {
              console.error(err);
          });
        }
    },
    created() {
        this.fetchRoleData();
        this.fetchRefereeData();
        this.fetchUnassignedData();
        this.fetchNumberGame(); 
  }
}

Vue.createApp(SomeApp).mount('#someApp');