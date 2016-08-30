var nodeKinds = {'disk': 'Disk', 'mss': 'MSS', 'buffer': 'Buffer'}
var userGroups = ["eprecated-ewk","muon","e-gamma_ecal","b-tagging","higgs","top","b-physics","jets-met_hcal","heavy-ions","trigger","susy","tau-pflow","tracker-dpg","exotica","deprecated-qcd","forward","DataOps","FacOps","local","AnalysisOps","tracker-pog","caf-alca","caf-comm","caf-phys","upgrade","IB RelVal","RelVal","express","dqm","deprecated-undefined","SMP","B2G","caf-lumi","null"] 
var resultFields = {'destBytes': 'Destination bytes', 'nodeBytes': 'Node bytes'}


module.exports= {

    getNodeKinds: function(){ return nodeKinds},
    getUserGroups: function(){ return userGroups},
    getResultFields: function(){ return resultFields}

}
