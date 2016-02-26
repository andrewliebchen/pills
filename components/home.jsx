const _ = lodash;

Home = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      medications: Medications.find().fetch()
    };
  },

  getInitialState() {
    return {
      wakeTime: 9,
      bedTime: 9,
      dayLength: 12
    };
  },

  handleSaveDayLength() {
    const wakeTime = parseInt(this.refs.wake.value);
    const bedTime = parseInt(this.refs.sleep.value);
    const dayLength = (bedTime + 12) - wakeTime;
    this.setState({
      wakeTime: wakeTime,
      bedTime: bedTime,
      dayLength: dayLength
    });
  },

  render() {
    const {medications} = this.data;
    const {wakeTime, bedTime, dayLength} = this.state;
    return (
      <div className="wrapper">
        <section className="panel panel-default">
          <div className="panel-body">
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
          </div>
        </section>

        <section className="panel panel-default">
          <header className="panel-heading">
            <h3 className="panel-title">Schedule</h3>
          </header>

          <table className="table">
            <thead>
              <tr>
                <th>Hour</th>
                <th/>
              </tr>
            </thead>
            <tbody>
              {_.times(dayLength, (i) => {
                const hour = wakeTime + i;
                return (
                  <tr key={i}>
                    <td>{hour}</td>
                    <td>
                      <ul className="list-group">
                        {medications.map((medication, i) => {
                          if(_.indexOf(medication.dose, hour) !== -1) {
                            return (
                              <li key={i} className="list-group-item">
                                💊 {medication.name}
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="panel-body">
            Add medication
          </div>
        </section>
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
