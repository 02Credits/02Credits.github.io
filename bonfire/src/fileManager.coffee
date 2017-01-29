define ["jquery", "arbiter"], ($, arbiter) ->
  div = document.getElementById('content')
  div.ondragenter = div.ondragover = (e) ->
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    false
  div.ondrop = (e) ->
    try
      url = e.dataTransfer.getData('URL')
      sent = false
      if url != ""
        sent = true
        $('.progress').fadeIn()
        $.ajax
          url: 'https://api.imgur.com/3/image'
          headers:
            'Authorization': 'Client-ID c110ed33b325faf'
          type: 'POST'
          data:
            'image': url
            'Authorization': 'Client-ID c110ed33b325faf'
          success: (result) ->
            arbiter.publish 'messages/send', {text: result.data.link, author: localStorage.displayName}
            $('.progress').fadeOut()
          error: () ->
            Materialize.toast("Image URL Upload Failed", 4000)
            $('.progress').fadeOut()
      else
        if e.dataTransfer.files.length != 0
          fileReader = new FileReader
          fileReader.onload = () ->
            $.ajax
              image: fileReader.result
              headers:
                'Authorization': 'Client-ID c110ed33b325faf'
              type: 'POST'
              datatype: "base64"
              success: (result) ->
                arbiter.publish 'messages/send', {text: result.data.link, author: localStorage.displayName}
              error: () ->
                Materialize.toast("Image URL Upload Failed", 4000)
          for file in e.dataTransfer.files
            if file.type.match /image.*/
              blob = file.slice()
              fileReader.readAsBinaryString(blob)
    catch error
      arbiter.publish 'error', error
    e.preventDefault()
