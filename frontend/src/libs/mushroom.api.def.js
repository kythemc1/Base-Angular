(function () {
//   console.log(MyConfig.host);
  var rootApiUrl = MyConfig.host;
  mushroom._defineResource({name:"faq",rootApiUrl:rootApiUrl,actions:{"findById":{"clientCache":true},"findMany":{"clientCache":true},"createOne":{},"updatePartially":{},"deleteOne":{},"deleteMany":{}},views:{}});
mushroom._defineResource({name:"feedback",rootApiUrl:rootApiUrl,actions:{"findById":{"clientCache":true},"findMany":{"clientCache":true},"createOne":{},"updatePartially":{}},views:{}});
mushroom._defineResource({name:"order",rootApiUrl:rootApiUrl,actions:{"findById":{"clientCache":true},"findMany":{"clientCache":true},"createOne":{},"updatePartially":{},"_raw_http_method_pay":{},"_raw_http_method_addStaffNote":{}},views:{}});
mushroom._defineResource({name:"account",rootApiUrl:rootApiUrl,actions:{"findById":{"clientCache":true},"findMany":{"clientCache":true},"updatePartially":{}},views:{}});
mushroom._defineResource({name:"user",rootApiUrl:rootApiUrl,actions:{"findMany":{"clientCache":true},"findById":{"clientCache":true},"updatePartially":{}},views:{}});
mushroom._defineResource({name:"postcode",rootApiUrl:rootApiUrl,actions:{"findMany":{"clientCache":true},"findById":{"clientCache":true}},views:{}});
  mushroom.$using(rootApiUrl);
})();
