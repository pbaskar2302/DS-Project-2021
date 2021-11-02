const SomeApp = {
    data() {
        return{
            referee: {},
            assignment: {},
            game: {},
            selectedRole: null,
            roles: {},
            selectedGame: null,
            assignmentForm: {}
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
            // this.bookForm = Object.assign({}, this.selectedBook);
    }
},
    created() {
        // this.fetchAssignmentData();
        // this.fetchGameData();
        this.fetchRoleData();
}
}

Vue.createApp(SomeApp).mount('#someApp');