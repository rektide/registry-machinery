var
  path= require("path")
  machine= require("machine"),
  resolve= require("resolve")

var registered= module.exports= []

function RegistryMachinery(existing){
	if(existing.name === "RegistryMachinePack_pack"){
		return existing
	}
	return function RegistryMachinePack_pack(machinePack){
		var machines= existing.call(machine, machinePack)
		registered.push(machinePack)
		return machines
	}
}

module.exports= new Promise(function(cb, reject){
	resolve("machine", function(err, res){
		if(err){
			reject(err)
			return
		}
		var cached= require.cache[res]
		if(!cached){
			reject("Did not find module")
			return
		}
		if(!cached.exports.pack){
			reject("Did not find pack")
			return
		}
		var packPath = path.dirname(res) + "/lib/Machine.pack.js"
		var constructorPath = path.dirname(res) + "/lib/Machine.constructor.js"
		require.cache[res].exports.pack= RegistryMachine(require.cache[res].exports.pack)
		require.cache[packPath].exports= RegistryMachine(require.cache[packPath].exports)
		require.cache[constructorPath].exports.pack= RegistryMachine(require.cache[constructorPath].exports.pack)
		machine.pack= RegistryMachine(machine.pack)
		cb(machine)
	})
})
