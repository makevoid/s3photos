guard 'haml', input: "src", output: '.', haml_options: { format: :html5 } do
  watch %r{^src/.+\.haml}
end
guard 'sass', input: 'src', output: '.'
guard 'coffeescript', input: 'src', output: '.'
guard 'livereload' do
  watch(%r{^src/.+\.(haml|coffee|sass)})
end