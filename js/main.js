// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.4/firebase-app.js";
import { arr, firebaseConfig, BASE_PATH } from "./constant.js"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Initialize Firebase
const app = initializeApp(firebaseConfig);
import {
  getDatabase,
  query,
  limitToFirst,
  limitToLast,
  orderByChild,
  startAt,
  startAfter,
  endAt,
  endBefore,
  equalTo,
  ref,
  onValue,
  get,
  set,
  child,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.9.4/firebase-database.js";

const db = getDatabase();


// SETTINGS - FB
var arrNonValidPath = [
  { "type": ".", "replace": "DOT" },
  { "type": "#", "replace": "HASH_SIGN" },
  { "type": "$", "replace": "DOLLAR_SIGN" },
  { "type": "[", "replace": "OPEN_BRACKET" },
  { "type": "]", "replace": "CLOSE_BRACKET" },
  { "type": " ", "replace": "_" }
]

// initialize FB 
var stdNo;
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;


// main function to initizalize onload
$(document).ready(function () {



  // END INITIALIZATION OF FB

  var current_page = 1;
  var max_page = 0;
  var page_main_tittles = [];
  var page_sub_tittles = [];

  // updatePaging(current_page,max_page,page_main_tittles,page_sub_tittles)

  $('.btn-next').click(function () {
    current_page++;
    updatePaging(current_page, max_page, page_main_tittles, page_sub_tittles)
  })
  $('.btn-prev').click(function () {
    current_page--;
    updatePaging(current_page, max_page, page_main_tittles, page_sub_tittles)
  })


  var unique = + new Date();
  // console.log(unique);
  var top = true;
  var number_tops = 0;

  fetch("js/settings.json?ver=" + unique)
    .then(response => {
      return response.json();
    })
    .then(function (data) {
      top = data.show_top
      number_tops = data.number_of_top

      //inner
      fetch("js/views.json?ver=" + unique)
        .then(response => {
          return response.json();
        })
        .then(function (data) {
          var count_page = 1;
          // console.log(data.today);

          data.jsonData.forEach(setTables);
          // data.yesterday.forEach(setViewsYesteday); 

          function setPages(item, index) {

          }

          function setTables(item, index) {

            // Pagination setup
            max_page++;
            page_main_tittles.push(item.tittle);
            page_sub_tittles.push(item.subTittle);

            // Setup Table content for views per page

            var total = 0;
            // var tittle = item.tittle;
            $('.append_pages').append(
              `
        <table name="${item.tittle}" class="table table-light table-striped table-hover table-paging table-page-${count_page}" id="maintable${count_page}"> 
            <thead>
              <tr > 
                <th  class="lokals-item d-flex justify-content-between align-items-center"> 
                  <div class="p-2 bd-highlight  ">Lokal</div> 
                  <div class="p-2 bd-highlight   ">Views</div>
                </th> 
              </tr>
            </thead>
            <tbody class="append_table-${count_page}"  id="tbody${count_page}" >
          </tbody>
        </table>
        `)


            var page = item.page;
            var redirectPage = item.redirectPage;
            var links = []
            item.viewData.map((subItem, index) => {
              if(subItem.link != "")
                links.push({ name: subItem.lokal, link:subItem.link, source: subItem?.dataSource } ) 
            })
 
            // item.viewData.forEach(setLokals);
            // function setLokals(item, index) {
            //   total += item.views; 

            //   // Setup Lokal content and views for each page
            //   $('.append_table-'+count_page).append(""+
            //   '<tr> '+
            //   '    <td > '+
            //   '        <a href="'+(redirectPage == true? page+'?pageId='+count_page+'&lokal='+item.lokal : '#' )+'" class="lokals-item d-flex justify-content-between align-items-center" id="lokal_'+item.lokal+'">'+
            //   '          <div class="p-2 link-dark post-title">'+item.lokal+'</div> '+
            //   '          <div class="p-2 link-dark view-counter '+item.lokal+'_view">'+Math.round(item.views)+'</div>'+
            //   '        </a>'+
            //   '    </td>  '+
            //   '  </tr>  '+
            //   "")
            // }

            if (item?.viewDataType === 'firebase') {
              GetAllDataRealtime("tbody" + count_page, "maintable" + count_page, {link: links, redirectPage: redirectPage, count_page: count_page, page: page }, `${BASE_PATH}viewTotal`, true);

            } else {
              const appendedLokals = item.viewData.map((item, index) => {
                total += item.views;
                return `
            <tr> 
                <td > 
                    <a href="${(redirectPage == true ? (item.link != "" ? item.link : page + '?pageId=' + count_page + '&lokal=' + item.lokal) : '#')}" class="lokals-item d-flex justify-content-between align-items-center" id="lokal_${item.lokal}">
                      <div class="p-2 link-dark post-title">${item.lokal}</div> 
                      <div class="p-2 link-dark view-counter ${item.lokal}_view">${Math.round(item.views)}</div>
                    </a>
                </td>  
              </tr>  
            `
              })
              $('.append_table-' + count_page).append(appendedLokals)

              // Just for empty space
              $('.append_table-' + count_page).append(`
            <tr> 
              <td >        
                <div class="lokals-item lokals-footer d-flex justify-content-between align-items-center">
                  <h3 class="p-2 link-dark post-title text-danger"></h3> 
                  <h3 class="p-2 link-dark view-counter text-danger "></h3>
                </div> 
              </td>  
            </tr>
              `)

              // Get total at the end of every page
              $('.append_table-' + count_page).append(`
            <tr> 
              <td >        
                <div class="lokals-item lokals-footer d-flex justify-content-between align-items-center">
                  <h3 class="p-2 link-dark post-title text-danger">Total</h3> 
                  <h3 class="p-2 link-dark view-counter text-danger total_view">${Math.round(total)}</h3>
                </div> 
              </td>  
            </tr>
              `)
            }



            //tops xx locals  
            if (top) {

              $('.append_tops').append(`
            <table   class="table table-striped table-light table-hover top_pages_table top_pages-tables-${count_page}"  id="totaltable${count_page}">
                <thead>
                  <tr > 
                    <th  class="lokals-item d-flex justify-content-between align-items-center"> 
                      <div class="p-2 bd-highlight  ">Top ${number_tops} Lokal </div> 
                      <div class="p-2 bd-highlight   ">Views</div>
                    </th> 
                  </tr>
                </thead>
                <tbody class="top_pages-${count_page}" id="tbodyTable${count_page}">  
              </tbody>
            </table>
            `)


              if (item?.viewDataType === 'firebase') {
                GetAllDataRealtime("tbodyTable" + count_page, "totaltable" + count_page, { link: links, redirectPage: false, count_page: count_page, page: '#' }, `${BASE_PATH}viewTotal`, false);

              } else {

                var arrTops = item.viewData;
                arrTops.sort(function (a, b) {
                  return b.views - a.views;
                });
                arrTops = arrTops.slice(0, number_tops);

                arrTops.forEach((item, index) => {
                  total += item.views;

                  // Setup Lokal content and views for each page
                  $('.top_pages-' + count_page).append(`
                <tr> 
                    <td > 
                        <a href="${(redirectPage == true ? page + '?pageId=' + count_page + '&lokal=' + item.lokal : '#')}" class="lokals-item d-flex justify-content-between align-items-center" id="lokal_${item.lokal}">
                          <div class="p-2 link-dark post-title">${item.lokal}</div> 
                          <div class="p-2 link-dark view-counter ${item.lokal}_view">${Math.round(item.views)}</div>
                        </a>
                    </td>  
                  </tr>  
                `)
                });
              } 
            }
 
            count_page++;
          }
 
          updatePaging(current_page, max_page, page_main_tittles, page_sub_tittles)

        }).catch(function (error) {
          // console.log(error);
        });



    }).catch(function (error) {
      // console.log(error);
    });

  function updatePaging(current_page, max_page, page_main_tittles, page_sub_tittles) {
    // console.log(page_sub_tittles[0])
    $('.table-paging').hide()
    $('.top_pages_table').hide()

    $('.table-page-' + current_page).show()
    $('.top_pages-tables-' + current_page).show()

    $('.page-main-tittle').text(page_main_tittles[current_page - 1])
    $('.page-tittle').text('' + page_sub_tittles[current_page - 1])


    if (current_page <= 1) {
      $('.btn-prev').hide()
    } else {
      $('.btn-prev').show()
    }

    if (current_page == max_page) {
      $('.btn-next').hide()
    } else {
      $('.btn-next').show()
    }
  }


  // Firebase Table functions


  // Filling The Table
  async function AddItemToTable(name, count, element, metaData, isRegular) {
    stdNo++;

    var oldName = name
    name = checkValidArg(arrNonValidPath, name)
    // console.log(name)

    var redirectLink ="";
    var dataSource = "";
    var countFromOtherSource = 0
    

    //check all stored datas of lokals that contains link
    metaData?.link?.forEach( (item) =>{  
      if(item.name.toUpperCase() === name){ 
        redirectLink = item.link
        dataSource = item.source
      } 
    })

    // if current lokal has different data source
    // if(redirectLink !== "" && dataSource !== ""){
      // const reference = ref(db, dataSource);
      //  await get(reference).then((snapshot) => {
        
      //   snapshot.forEach((childSnapshot) => {  
      //     console.log(childSnapshot.val() )
      //     countFromOtherSource += parseInt( childSnapshot.val().count)
      //     console.log(countFromOtherSource)
      //   });  
      // }, (error) => {
      //     console.error(error); 
      // });

      // const que = query(ref(db, dataSource)); 

      //  get(que).((snapshot) => {
  
      //   snapshot.forEach((childSnapshot) => {  
      //     console.log(childSnapshot.val() )
      //     countFromOtherSource += parseInt( childSnapshot.val().count)
      //     // console.log(countFromOtherSource)
      //   });  

      //   $("body").find(`lokal_${(isRegular ?oldName : "totals_"+oldName)}`).find('.view-counter').text(countFromOtherSource)
      //   // console.log($("body").find(`#lokal_${oldName}`).find('.view-counter') )
      // })

      // console.log('count final', countFromOtherSource)
    // }
    
 
 
    $("#" + element).append(`
            <tr> 
                <td > 
                    <a href="${(metaData?.redirectPage == true ?( redirectLink !=="" ?  redirectLink : metaData?.page + '?pageId=' + metaData?.count_page + '&lokal=' + name) : '#')}" class="lokals-item d-flex justify-content-between align-items-center" id="lokal_${(isRegular ?oldName : "totals_"+oldName)}">
                      <div class="p-2 link-dark post-title">${name}</div> 
                      <div class="p-2 link-dark view-counter ${name}_view">${Math.round(count)}</div>
                    </a>
                </td>  
              </tr>  
            `
    )
  }

  function AddAllItemsToTable(dataSelect, id, table, metaData, customFunction, isRegular) {
    // if ($.fn.DataTable.isDataTable("#" + table)) {
    //   $("#" + table)
    //     .DataTable()
    //     .clear()
    //     .destroy();
    // }
    let total = 0
    stdNo = 0;
    //   tbody.innerHTML = "";
    $("#" + id).empty();

    dataSelect.forEach((element) => {
      total += element.count;
      AddItemToTable(element.name, element.count, id, metaData, isRegular);
    });


    if (dataSelect?.length > 0) {

    } else {
      // console.log(arr, 'wala laman!')
      arr.forEach((item) => {
        AddItemToTable(item, 0, id, metaData, isRegular);
      })
    }

    customFunction({
      total: total,
    })



    return total;

    // $("#" + table).DataTable(dataTable_config);
  }

  //  -- Get All Data

  function GetAllDataOnce(id, date, table) {
    // const que = query( ref (db, "TheStdents"), orderByChild("Section"),startAt("B"));
    const que = query(ref(db, "ViewsCount/" + date));
    get(que).then((snapshot) => {
      var students = [];

      snapshot.forEach((childSnapshot) => {
        students.push(childSnapshot.val());
      });

      AddAllItemsToTable(students, id, table, false);
    });
  }

  // Get All Data REALTIME

  function GetAllDataRealtime(id, table, metaData, path, isRegular) {
    // document.getElementById("tbody").innerHTML ="";
    const que = query(ref(db, path));

    onValue(que, (snapshot) => {
      var responseData = [];

      snapshot.forEach((childSnapshot) => {
        responseData.push(childSnapshot.val());
      });
 

      // responseData.forEach( async(subData,index)=>{ 
      //   var dataSource = "";
      //   var countFromOtherSource = 0 
      //   var tempName =   checkValidArg(arrNonValidPath, subData.name)
      //   //check all stored datas of lokals that contains link
      //   metaData?.link?.forEach( (item) =>{ 
      //     if(item.name.toUpperCase() === tempName){  
      //       dataSource = item.source
      //     } 
      //   })
         
      //   if( dataSource !== ""){
      //     const reference = ref(db, dataSource);
      //      await get(reference).then((snapshot) => {
            
      //       snapshot.forEach((childSnapshot) => {  
      //         // console.log(childSnapshot.val() )
      //         countFromOtherSource += parseInt( childSnapshot.val().count)
      //         console.log(countFromOtherSource)
      //       });  
      //     }, (error) => {
      //         console.error(error); 
      //     }); 

      //     // console.log('final source',countFromOtherSource)
      //     responseData[index].count = countFromOtherSource
      //   }


      // })
 


      // console.log(responseData, id, table)
      if (isRegular) {

        const customFunction = (meta) => {

          // Just for empty space 
          $('.append_table-' + metaData?.count_page).append(`
          <tr> 
            <td >        
              <div class="lokals-item lokals-footer d-flex justify-content-between align-items-center">
                <h3 class="p-2 link-dark post-title text-danger"></h3> 
                <h3 class="p-2 link-dark view-counter text-danger "></h3>
              </div> 
            </td>  
          </tr>
            `)

          // Get total at the end of every page
          $('.append_table-' + metaData?.count_page).append(`
          <tr> 
            <td >        
              <div class="lokals-item lokals-footer d-flex justify-content-between align-items-center">
                <h3 class="p-2 link-dark post-title text-danger">Total</h3> 
                <h3 class="p-2 link-dark view-counter text-danger total_view">${Math.round(meta?.total)}</h3>
              </div> 
            </td>  
          </tr>
            `)
        }

 

        AddAllItemsToTable(responseData, id, table, metaData, customFunction, isRegular);
      }
      else {

        const customFunction = (meta) => { }

        var arrTops = responseData;
        arrTops.sort(function (a, b) {
          return b.count - a.count;
        });

        arrTops = arrTops.slice(0, number_tops);
        // console.log(arrTops)

        AddAllItemsToTable(arrTops, id, table, metaData, customFunction, isRegular);
      }

    });
  }


  // Utility functions

  function checkValidArg(arrNonValidPath, arrVal) {

    var result = arrNonValidPath.filter(x => arrVal.includes(x.replace));
    if (result.length > 0) {

      // console.log(result); 
      result.forEach((x) => {
        arrVal = fixPathArgs(x, arrVal);
      })

    }

    return arrVal;

  }


  function fixPathArgs(arrResult, word) {

    let replace = arrResult.replace;
    // console.log(arrResult)
    const regex = new RegExp(`${replace}`, "g");
    word = word.replace(regex, arrResult.type);

    return word;

  }

   

})

