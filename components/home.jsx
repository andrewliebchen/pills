const _ = lodash;

Home = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      medications: Medications.find().fetch()
    };
  },

  handleSaveDayLength() {
    const wakeTime = parseInt(this.refs.wake.value);
    const bedTime = parseInt(this.refs.sleep.value);
    console.log((bedTime + 12) - wakeTime); // length of day
  },

  render() {
    const {medications} = this.data;
    return (
      <div className="wrapper">
        <div className="form-group">
          <label>What time do you usually wake up?</label>
          <div className="input-group">
            <input type="number" min="1" max="12" className="form-control" ref="wake"/>
            <div className="input-group-addon">am</div>
          </div>
        </div>
        <div className="form-group">
          <label>What time do you usually go to bed?</label>
          <div className="input-group">
            <input type="number" min="1" max="12" className="form-control" ref="sleep"/>
            <div className="input-group-addon">pm</div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={this.handleSaveDayLength}>
          Save
        </button>

        {medications.map((medication, i) => {
          return (
            <table className="table" key={i}>
              <thead>
                <tr>
                  <th>Name</th>
                  {_.times(24, (i) => {
                    return <th key={i}>{i}</th>;
                  })}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{medication.name}</td>
                  {_.times(24, (i) => {
                    console.log(_.indexOf(medication.dose, i));
                    return (
                      <td key={i}>
                        {_.indexOf(medication.dose, i) === -1 ? '' :  '💊'}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          );
        })}
      </div>
    );
  }
});

if(Meteor.isClient) {
  FlowRouter.route('/', {
    subscriptions() {
      this.register('medications', Meteor.subscribe('medications'));
    },

    action() {
      FlowRouter.subsReady('medications', () => {
        DocHead.setTitle('Pills');
        ReactLayout.render(Layout, {
          content: <Home/>
        });
      });
    }
  });
}
