const mqtt = require('mqtt');

// Internal MQTT conection
try {
    device = mqtt.connect('mqtt:0.0.0.0');
  
    device.on("connect", () => {
      console.log("connected");
    });
  
    device.on("message", async (topic) => {
      if (topic === "device/client_error") {
        console.log("erro")
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(0);
  }

let a = new Date();

setInterval(()=>{
    let a = new Date();
    test = solarSimulation((a.getMinutes() + a.getHours()*60));
    solar ={
        "pV1Voltage": test.voltage,
        "pV1Current": test.current,
        "pV1Power": test.power,
    }
    device.publish("solar/periodic",JSON.stringify(solar));
    console.log(solar);
    console.log(count,powerFactor);
},1000);

let count = 0;
let powerFactor=1;

function solarSimulation(currentMinutes){
    result = {};
    result.power = -13/441*currentMinutes*currentMinutes + 2080/49*currentMinutes -494000/49;
    result.voltage = -20/1849*currentMinutes*currentMinutes + 28800/1849*currentMinutes -6670000/1849;
    if(result.voltage>350){
        result.voltage=350;
    }
    result.power = result.power + (Math.random()*(50)-25);
    result.voltage = result.voltage + (Math.random()*(2)-1);
    if(count<0){
        count = Math.random()*(1500)+300
        if(powerFactor>=0.7){
            powerFactor = Math.random()*(0.3)+0.7;
        }
        if(powerFactor<=0.3){
            powerFactor = Math.random()*(0.3);
        }
    }
    result.power = result.power*powerFactor;
    if(result.power<0){
        result.power = 0;
    }
    if(result.voltage<0){
        result.voltage = 0;
    }
    result.current = result.power/result.voltage;
    count--;
    return result;
}
