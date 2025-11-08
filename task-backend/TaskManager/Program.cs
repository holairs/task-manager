    using Microsoft.EntityFrameworkCore;
    using TaskManager.Data;

    var builder = WebApplication.CreateBuilder(args);

    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));



    builder.Services.AddControllers();

    // Configuración de CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("CorsPolicy",
            policy =>
            {
                policy.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            });
    });

    // Configuración de Swagger/OpenAPI (Documentación)
    builder.Services.AddEndpointsApiExplorer();
    builder.Services.AddSwaggerGen(c => { c.SwaggerDoc("v1", new() { Title = "Task Manager API", Version = "v1" }); });

    var app = builder.Build();

    // --- 2. CONFIGURACIÓN DEL PIPELINE ---

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Manager API V1");
            c.RoutePrefix = "docs";
        });
    }

    app.UseHttpsRedirection();
    app.UseCors("CorsPolicy");
    app.MapControllers();

    // --- 3. INICIALIZACIÓN DE LA BASE DE DATOS ---

    using (var scope = app.Services.CreateScope())
    {
        var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // Ejecutar EnsureCreated para crear las tablas
        context.Database.EnsureCreated();
    }

    app.Run();