import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

export const capitalizeFirstLetter = (str)=> {

  // converting first letter to uppercase
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);

  return capitalized;
}


export const getErrorMessage = (errorRes,common_msg) => {
    errorRes = errorRes?.response?.data;
     // eslint-disable-next-line
    let _error = "";

    common_msg = common_msg || "Something went wrong. Please try again later."

    try{
      Object.keys(errorRes).map((key, index) => {
          for (let i = 0; i < errorRes[key].length; i++) {
              _error = _error + capitalizeFirstLetter(errorRes[key][i])
          }
      })
      return _error == "" ? common_msg : _error
    }catch(e){
      return common_msg
    }
}

export const validatePhoneNumber = (phoneNumber = '') => {

  const reg = /^([+])\d{8,14}$/
  return reg.test(phoneNumber)
}

export const send_push_notification = (device_id, token ) => {

  fetch('https://fcm.googleapis.com/fcm/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAGV9o6Mo:APA91bHDXrgGqGBM0S_y9elMSAOy5LIj58JB7mlvzzaDbsXnJN8ozE9bpTa8RWcvhniQaArQbdfueIrLFClbknhre_KKNUkP3WgAY2-_JsyH-o7tcjPNvKDO241ifAEJery3SEug5xp_',
    },
    body: JSON.stringify({
      to: item.device_token,
      notification: {
        body: `Tap to join the ${isVoiceCall ? 'voice' : 'video'} call`,
        title:
          current_user?.fullname +
          ` is inviting you to a ${isVoiceCall ? 'voice' : 'video'} call`,
        room_id: item.room_id,
        user_name: item?.fullname,
        voice: isVoiceCall ? 'true' : 'false',
      },
      data: {
        channel_id:"fcm_call_channel",
        body: `Tap to join the ${isVoiceCall ? 'voice' : 'video'} call`,
        title:
          current_user?.fullname +
          ` is inviting you to a ${isVoiceCall ? 'voice' : 'video'} call`,
        room_id: item.room_id,
        user_name: item?.fullname,
        voice: isVoiceCall ? 'true' : 'false',
      },
      android: {
        priority: 'high',
      },
    }),
  });

}


export const getDBConnection = () => {
  //return SQLite.opebDatabase({name: "badge.db", location: "default"});
  const db = SQLite.openDatabase(
    {
      name: 'MainDB',
      location: 'default', // Ensures the database is saved locally
    },
    () => console.log('Database opened successfully'),
    error => console.log('Error opening database: ', error)
  );
  return db;
}

export const createTable = async(db) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        user VARCHAR(20), 
        count INT
      );`,
      [],
      () => console.log('badges Table created successfully'),
      error => console.log('Error creating table: ', error)
    );
  });
}

export const addHobies= (db, data) => {
  if (!data) {
    console.log('data not available');
    return false;
  } else {
    db.transaction(txn => {
      txn.executeSql(`INSERT INTO badges(user, count) VALUES (?, ?)`,[data.user, data.count],(sqlTxn, res) => {
        console.log(`${data.user} added successfully`);
      },
      error => {
        console.log('error on adding hobby ' + error.message);
        return false;
      },
      );
    });
    return true;
  }
}

export const updateHobies= (db, data) => {
  if (!data) {
    console.log('data not available');
    return false;
  } else {
    db.transaction(txn => {
      txn.executeSql(`UPDATE badges SET count = ? WHERE user = ?`,[data.count, data.user],(sqlTxn, res) => {
        console.log(`${data.user} added successfully`);
      },
      error => {
        console.log('error on adding hobby ' + error.message);
      },
      );
    });
  }
}

export const getLocalData = (db, setData) => {
  let result = [];
  db.transaction(txn => {
  txn.executeSql(`SELECT * FROM badges`, [], (sqlTnx, res) => {
    console.log('data retrieved successfully');
    let len = res.rows.length;
    console.log('data retrieved successfully', len);
    if (len > 0) {
      for (let i = 0; i < len; i++) {
        const item = res.rows.item(i);
        result.push({
          id: item.id,
          user: item.user,
          count: item.count
        });
      }
      setData(result);
      console.log('data retrieved successfully', result);
      //return result;
    }
  },
  error => {
    console.log('error in getting result: ', error.message);
  },
  );
  });
}

export const deleteItem = (db, id) => {
  let query = `DELETE * FROM badges WHERE id = ${id}`;
  db.transaction(txn => {
    txn.executeSql( query,[],(sqlTnx, res) => {
    console.log('item deleted successfully');
    },
    error => {
      console.log('error in getting restaurant: ', error.message);
    },
    );
  });
}

export const checkInsert = (db, data) => {
  db.transaction(txn => {
  txn.executeSql(`SELECT * FROM badges WHERE user = ?`, [data.user], (sqlTnx, res) => {
    //console.log('data retrieved successfully');
    let len = res.rows.length;
    //console.log('data inserted successfully', len);
    if (len > 0) {
      const item = res.rows.item(0);
      let cont = item.count + 1 ;
      let toupdate = { user: item.user, count: cont, id: item.id };
      console.log('toupdate =>', toupdate)
      //setdbData(toupdate);
      updatedata(db, toupdate);
      //console.log('data retrieved successfully', item);
    }else{
      inserdata(db, data);
      let toupdate = { user: data.user, count: 1, id: item.id };
      //setdbData(toupdate);
    }
  },
  error => {
    console.log('error in getting result: ', error.message);
  },
  );
  });
}

const updatedata = (db, data) => {
  db.transaction(txn => {
    txn.executeSql(`UPDATE badges SET user = ?, count = ? WHERE id = ?`,[data.user, data.count, data.id],(sqlTxn, res) => {
      console.log(`${data.user} updated successfully`);
    },
    error => {
      console.log('error on adding hobby ' + error.message);
    },
    );
  });
}

const inserdata = (db, data) => {
  db.transaction(txn => {
    txn.executeSql(`INSERT INTO badges(user, count) VALUES (?, ?)`,[data.user, data.count],(sqlTxn, res) => {
      console.log(`${data.user} added successfully`);
    },
    error => {
      console.log('error on adding hobby ' + error.message);
      return false;
    },
    );
  });
}